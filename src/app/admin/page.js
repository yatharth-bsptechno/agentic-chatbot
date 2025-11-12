import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, MessageCircle, Tag } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export default async function Dashboard() {
  await connectDB();
  const totalUsers = await User.countDocuments();
  const taggedUsers = await User.countDocuments({
    finalRole: { $ne: null, $ne: "unknown" },
  });
  const todayUsers = await User.countDocuments({
    createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Tagged Today"
          value={todayUsers}
          icon={MessageCircle}
          color="green"
        />
        <StatsCard
          title="Roles Assigned"
          value={taggedUsers}
          icon={Tag}
          color="purple"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Go to Users → Roles to manage everything.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
