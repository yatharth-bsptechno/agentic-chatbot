"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: e.target.email.value,
      password: e.target.password.value,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      // Success → force reload to trigger layout session check
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="admin@yourapp.com"
              defaultValue="admin@yourapp.com"
              required
              disabled={loading}
            />
            <Input
              name="password"
              type="password"
              placeholder="admin123"
              defaultValue="admin123"
              required
              disabled={loading}
            />
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p>Credentials:</p>
            <p>
              <strong>Email:</strong> admin@yourapp.com
            </p>
            <p>
              <strong>Password:</strong> admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
