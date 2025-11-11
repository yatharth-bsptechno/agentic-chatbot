// src/app/api/session/route.js
import { connectDB } from "@/lib/db.js";
import { ensureRolesSeeded } from "@/seedRoles.js";
import { User } from "@/models/User.js";
import Role from "@/models/Role.js";

export async function POST() {
  try {
    await connectDB();
    await ensureRolesSeeded();

    const roles = await Role.find().lean();
    const possible = roles.map((r) => r.role);

    const user = await User.create({
      info: { name: null, email: null, mobile: null, address: null },
      stage: "collecting_info",
      possibleRoles: possible,
      eliminatedRoles: [],
      finalRole: null,
      roleInferenceReason: null,
      chatHistory: [{ from: "bot", message: "Hi! What's your name?" }],
    });

    return new Response(
      JSON.stringify({
        userId: user._id.toString(),
        firstMessage: "Hi! What's your name?",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Session error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to start", details: error.message }),
      { status: 500 }
    );
  }
}
