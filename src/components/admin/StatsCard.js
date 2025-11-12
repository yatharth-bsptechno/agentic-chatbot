import { Card } from "@/components/ui/card";

export default function StatsCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className={`p-4 rounded-full ${colors[color]}`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </div>
    </Card>
  );
}
