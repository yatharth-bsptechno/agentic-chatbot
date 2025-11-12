// src/app/api/admin/users/[id]/tag/route.js
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = params;
  const { role } = await req.json();

  if (
    !role ||
    ![
      "customer",
      "distributor",
      "partner",
      "service_agent",
      "unknown",
    ].includes(role)
  ) {
    return new Response("Invalid role", { status: 400 });
  }

  try {
    await connectDB();
    await User.findByIdAndUpdate(id, {
      finalRole: role,
      roleInferenceReason: "Manually tagged by admin",
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}
