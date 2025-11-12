// src/lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const ADMIN_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMye8YcJ1X8W6QjfK47P7z2g5pW7p2g6pW6"; // "admin123"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (
          credentials.email === "admin@yourapp.com" &&
          bcrypt.compareSync(credentials.password, ADMIN_HASH)
        ) {
          return { id: "1", name: "Admin", email: "admin@yourapp.com" };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/admin/login", error: "/admin/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
