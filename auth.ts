import NextAuth, { NextAuthConfig, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";

// Password hashing and verification using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(hashBuffer).toString("hex");
}

async function verifyPassword(
  inputPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const hashedInput = await hashPassword(inputPassword);
  return hashedInput === hashedPassword;
}

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: { params: { scope: "repo read:user read:email" } },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password,
        );

        return isValid
          ? {
              id: user.id.toString(),
              email: user.email!,
              role: user.role ?? "user",
              name: user.name!,
            }
          : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role ?? "user";

        if (!token.sub) {
          console.error("Missing userId in JWT callback.");
          return token;
        }

        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { subscription: true, useWebhook: true },
        });

        token.subscription = dbUser?.subscription ?? "free";
        token.useWebhook = dbUser?.useWebhook ?? false;

        // Store GitHub token if present
        if (account?.provider === "github" && account.access_token) {
          try {
            await prisma.githubToken.upsert({
              where: { userId: token.sub },
              create: { userId: token.sub, accessToken: account.access_token },
              update: { accessToken: account.access_token },
            });

            // Store in JWT token for easy access
            token.githubAccessToken = account.access_token;
          } catch (error) {
            console.error("Error storing GitHub token:", error);
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (!token.sub) return session;
      const githubToken = await prisma.account.findFirst({
        where: { userId: token.sub, provider: "github" },
        select: { access_token: true },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
          role: token.role,
          hasGithubToken: !!(await prisma.githubToken.findUnique({
            where: { userId: token.sub as string },
          })),
          githubAccessToken: githubToken?.access_token || null,
          subscription: token.subscription ?? "free",
          useWebhook: token.useWebhook ?? false,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
