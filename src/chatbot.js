import { openai } from "./lib/openai.js";
import validator from "validator";
import { CONFIG } from "./lib/config.js";
import { eliminateRolesForUser } from "./roleInfer.js";

const INFO_FIELDS = ["name", "email", "mobile", "address"];

function extractEmail(text) {
  const match = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  return match && validator.isEmail(match[0]) ? match[0] : null;
}

function extractMobile(text) {
  const digits = (text.match(/[0-9()+\-.\s]{7,}/g) || []).join(" ");
  const normalized = digits.replace(/[^\d]/g, "");
  if (normalized.length >= 8 && normalized.length <= 15) return normalized;
  return null;
}

function nextMissingField(user) {
  for (const f of INFO_FIELDS) {
    if (!user.info[f]) return f;
  }
  return null;
}

export async function handleUserMessage(user, text) {
  user.chatHistory.push({ from: "user", message: text });

  const missing = nextMissingField(user);

  if (user.stage === "collecting_info") {
    if (missing === "name") {
      const name = text.trim();
      if (name.length > 1) {
        user.info.name = name;
        const reply = `Thanks, ${name}. Could you share your email?`;
        user.chatHistory.push({ from: "bot", message: reply });
        return reply;
      } else {
        const reply = "Hi! What's your name?";
        user.chatHistory.push({ from: "bot", message: reply });
        return reply;
      }
    }

    if (missing === "email") {
      const email = extractEmail(text);
      if (email) {
        user.info.email = email;
        const reply = `Got it. What's your mobile number?`;
        user.chatHistory.push({ from: "bot", message: reply });
        return reply;
      } else {
        const reply = "Please share a valid email (we’ll keep it private).";
        user.chatHistory.push({ from: "bot", message: reply });
        return reply;
      }
    }

    if (missing === "mobile") {
      const mobile = extractMobile(text);
      if (mobile) {
        user.info.mobile = mobile;
        const reply = `Thanks. What's your address (city/area is fine)?`;
        user.chatHistory.push({ from: "bot", message: reply });
        return reply;
      } else {
        const reply =
          "Please share a reachable phone number (digits only are fine).";
        user.chatHistory.push({ from: "bot", message: reply });
        return reply;
      }
    }

    if (missing === "address") {
      const addr = text.trim();
      if (addr.length > 2) {
        user.info.address = addr;
        user.stage = "chatting";
        const reply = `All set. What would you like to know or do next?`;
        user.chatHistory.push({ from: "bot", message: reply });
        return reply;
      } else {
        const reply =
          "Could you share your address or location (city/area is fine)?";
        user.chatHistory.push({ from: "bot", message: reply });
        return reply;
      }
    }
  }

  const roleLabel = user.manualRole || user.finalRole || null;
  const roleHint = roleLabel
    ? `User's inferred/assigned role: ${roleLabel}.`
    : `User role not finalized (do NOT ask user about role).`;

  const system = `
You are a helpful business assistant.

Rules:
- Use the provided user info and conversation context.
- NEVER ask the user to identify as customer/distributor/partner/service_agent.
- Keep answers clear and concise.
- If information is missing, ask neutral clarifying questions (no role names).
`.trim();

  const context = `
Known user info: ${JSON.stringify(user.info)}
${roleHint}

Recent chat:
${user.chatHistory
  .slice(-12)
  .map((m) => `${m.from}: ${m.message}`)
  .join("\n")}
`.trim();

  let botReply = "Sorry, I couldn't respond.";
  try {
    const resp = await openai.chat.completions.create({
      model: CONFIG.OPENAI_MODEL,
      temperature: 0.5,
      max_tokens: 400,
      messages: [
        { role: "system", content: system },
        { role: "user", content: context },
      ],
    });
    botReply = resp.choices[0]?.message?.content?.trim() || botReply;
  } catch (e) {
    console.warn("OpenAI chat error:", e.message);
    botReply = "There was an issue generating a response.";
  }

  user.chatHistory.push({ from: "bot", message: botReply });
  await eliminateRolesForUser(user);

  return botReply;
}
