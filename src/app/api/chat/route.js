// src/app/api/chat/route.js
import { connectDB } from "@/lib/db.js";
import { User } from "@/models/User.js";
import { handleUserMessage } from "@/chatbot.js";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, message } = await req.json();

    if (!userId || !message?.trim()) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
      });
    }

    const reply = await handleUserMessage(user, message);
    await user.save();

    return new Response(
      JSON.stringify({
        reply,
        userId: user._id.toString(),
        roleState: {
          possibleRoles: user.possibleRoles,
          eliminatedRoles: user.eliminatedRoles,
          finalRole: user.finalRole,
          reason: user.roleInferenceReason || null,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: "AI error", details: error.message }),
      { status: 500 }
    );
  }
}
