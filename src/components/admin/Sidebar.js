"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Tags, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/roles", label: "Roles", icon: Tags },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-purple-600">Agentic</h1>
      </div>
      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                  active
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <form action="/api/auth/signout" method="post">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
