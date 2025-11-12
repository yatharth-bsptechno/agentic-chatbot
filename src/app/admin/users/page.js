import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import UserTable from "@/components/admin/UserTable";

export default async function UsersPage() {
  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Users</h1>
      <UserTable users={users.map((u) => ({ ...u, _id: u._id.toString() }))} />
    </div>
  );
}
