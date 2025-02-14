import NextAuth, { Account, NextAuthConfig, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { registerGitHubWebhook } from "./lib/githubWebhook";
import { prisma } from "./lib/prisma";

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
      // Allow linking GitHub to an already existing user (e.g. one created via Google)
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

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        return isValid
          ? {
              id: user.id.toString(), // Convert numeric ID to string
              email: user.email,
              role: user.role ?? "user", // Ensure role exists
              name: user.name,
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

        if (account?.provider === "github") {
          try {
            await prisma.githubToken.upsert({
              where: { userId: token.sub },
              create: { userId: token.sub, accessToken: account.access_token! },
              update: { accessToken: account.access_token! },
            });

            if (dbUser?.subscription === "pro" && dbUser?.useWebhook) {
              const githubUser = await fetch("https://api.github.com/user", {
                headers: { Authorization: `token ${account.access_token}` },
              }).then((res) => res.json());

              const repos = await fetch(githubUser.repos_url, {
                headers: { Authorization: `token ${account.access_token}` },
              }).then((res) => res.json());

              for (const repo of repos) {
                await registerGitHubWebhook(
                  token.sub,
                  githubUser.login,
                  repo.name,
                  account.access_token!,
                );
              }
            }
          } catch (error) {
            console.error("Error storing GitHub token:", error);
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (!token.sub) return session;

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
          role: token.role,
          hasGithubToken: !!(await prisma.githubToken.findUnique({
            where: { userId: token.sub as string },
          })),
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
