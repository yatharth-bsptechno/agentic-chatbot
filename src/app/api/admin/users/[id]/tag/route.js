import { connectDB } from "@/lib/db.js";
import { User } from "@/models/User.js";

export async function POST(req, { params }) {
  await connectDB();
  const { id } = params;
  const { role } = await req.json();
  if (!role)
    return new Response(JSON.stringify({ error: "role required" }), {
      status: 400,
    });

  const user = await User.findById(id);
  if (!user)
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });

  user.manualRole = role;
  user.finalRole = role;
  user.roleInferenceReason = "Manually tagged from backend";
  await user.save();

  return Response.json({ ok: true });
}
