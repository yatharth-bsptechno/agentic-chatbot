// src/app/admin/layout.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginPage from "./login/page";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <form action="/api/auth/signout" method="post">
          <button className="text-sm text-gray-600 hover:underline">
            Logout
          </button>
        </form>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}
