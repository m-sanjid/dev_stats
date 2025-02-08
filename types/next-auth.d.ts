import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string; // Mark as optional if your users might not have roles
  }

  interface Session {
    user: {
      id: string;
      role: string; // Make required if you always want to enforce roles
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string; // Ensure role is always present in JWT
  }
}
