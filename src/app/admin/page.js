import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <Link href="/admin/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>Manage chat sessions</CardContent>
          </Card>
        </Link>
        <Link href="/admin/roles">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Roles</CardTitle>
            </CardHeader>
            <CardContent>Edit role definitions</CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
