import { connectDB } from "@/lib/db.js";
import Role from "@/models/Role.js";

export async function POST(req) {
  await connectDB();
  const { role, definition } = await req.json();
  if (!role || !definition) {
    return new Response(
      JSON.stringify({ error: "role and definition required" }),
      { status: 400 }
    );
  }

  await Role.updateOne(
    { role },
    { $set: { role, definition } },
    { upsert: true }
  );
  return Response.json({ ok: true });
}
