import { openai } from "./lib/openai.js";
import { CONFIG } from "./lib/config.js";
import Role from "./models/Role.js";

function tryParseJSON(text) {
  try {
    const cleaned = text.trim().replace(/^```json\s*|\s*```$/g, "");
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function eliminateRolesForUser(user) {
  const roles = await Role.find().lean();
  const roleList = roles.map((r) => r.role);

  if (!user.possibleRoles || user.possibleRoles.length === 0) {
    user.possibleRoles = [...roleList];
    user.eliminatedRoles = [];
  }

  const combinedText = [
    `User info: ${JSON.stringify(user.info)}`,
    "Latest messages:",
    ...user.chatHistory.slice(-12).map((m) => `${m.from}: ${m.message}`),
  ].join("\n");

  const system = `
You are a classifier that performs ROLE ELIMINATION.
You are given role definitions and conversation context.

Rules:
- NEVER ask the user about their role.
- Eliminate roles contradicted by context.
- Only set "final_if_certain" if evidence is strong.
- Output STRICT JSON ONLY:

{
  "eliminate": ["role1","role2"],
  "final_if_certain": null | "role",
  "justification": "short reason"
}
`.trim();

  const roleDefs = roles.map((r) => ({
    role: r.role,
    definition: r.definition,
  }));

  const messages = [
    { role: "system", content: system },
    {
      role: "user",
      content:
        `Role definitions: ${JSON.stringify(roleDefs)}\n\n` +
        `Context:\n${combinedText}\n\n` +
        `Known possible roles (remaining): ${JSON.stringify(user.possibleRoles)}\n` +
        `Eliminated so far: ${JSON.stringify(user.eliminatedRoles)}\n`,
    },
  ];

  let elimination = {
    eliminate: [],
    final_if_certain: null,
    justification: "",
  };

  try {
    const resp = await openai.chat.completions.create({
      model: CONFIG.OPENAI_MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 300,
    });

    const content = resp.choices[0]?.message?.content || "{}";
    const parsed = tryParseJSON(content);
    if (parsed && Array.isArray(parsed.eliminate)) {
      elimination = parsed;
    } else {
      elimination = {
        eliminate: [],
        final_if_certain: null,
        justification: "Model returned invalid JSON",
      };
    }
  } catch (e) {
    console.warn("OpenAI elimination error:", e.message);
    elimination = {
      eliminate: [],
      final_if_certain: null,
      justification: "OpenAI error; no change",
    };
  }

  const toEliminate = elimination.eliminate.filter((r) =>
    user.possibleRoles.includes(r)
  );
  user.possibleRoles = user.possibleRoles.filter(
    (r) => !toEliminate.includes(r)
  );
  user.eliminatedRoles = Array.from(
    new Set([...(user.eliminatedRoles || []), ...toEliminate])
  );

  if (!user.finalRole && user.manualRole) {
    user.finalRole = user.manualRole;
    user.roleInferenceReason = "Manually tagged from backend";
  } else if (!user.finalRole) {
    if (
      elimination.final_if_certain &&
      user.possibleRoles.includes(elimination.final_if_certain)
    ) {
      user.finalRole = elimination.final_if_certain;
      user.roleInferenceReason =
        elimination.justification || "Confident inference by elimination";
    } else if (user.possibleRoles.length === 1) {
      user.finalRole = user.possibleRoles[0];
      user.roleInferenceReason = "Single role remaining after elimination";
    } else if (user.possibleRoles.length === 0) {
      user.finalRole = "unknown";
      user.roleInferenceReason =
        "All roles eliminated; ambiguous/contradictory";
    } else {
      user.roleInferenceReason =
        elimination.justification || "Ambiguous; continuing to observe";
    }
  }

  return user;
}