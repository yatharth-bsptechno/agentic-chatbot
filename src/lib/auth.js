// src/lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const email = credentials.email.toLowerCase();
        const password = credentials.password;

        // HARDCODED ADMIN — REAL HASH OF "admin123"
        const validHash =
          "$2b$10$sD93RSG5kTkrhm4Y5iI09.GBvtnStRXSja6jlaCF/MwoGnpTLarGO"; // bcrypt hash of "admin123"

        if (
          email === "admin@yourapp.com" &&
          bcrypt.compareSync(password, validHash)
        ) {
          console.log("ADMIN LOGIN SUCCESS");
          return {
            id: "1",
            name: "Admin",
            email: "admin@yourapp.com",
          };
        }

        console.log("Invalid login attempt:", { email, valid: false });
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login", // prevent redirect loop on error
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, token }) => {
      session.user.id = token.sub;
      return session;
    },
  },
};
