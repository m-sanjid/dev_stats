import NextAuth, { Account, NextAuthConfig, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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
        token.role = user.role ?? "user"; // Fallback to "user" if undefined

        // If this is a GitHub sign-in, store the access token
        if (account?.provider === "github") {
          try {
            // At this point, the user record should exist.
            await prisma.githubToken.upsert({
              where: { userId: user.id },
              create: {
                userId: user.id,
                accessToken: account.access_token!,
              },
              update: {
                accessToken: account.access_token!,
              },
            });
          } catch (error) {
            console.error(
              "Error storing GitHub token in jwt callback: ",
              error,
            );
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      const githubToken = await prisma.githubToken.findUnique({
        where: { userId: token.sub },
      });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role, // Now guaranteed to be a string
          hasGithubToken: !!githubToken,
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
