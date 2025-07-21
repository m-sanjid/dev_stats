"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

// Reuse the same password hashing function from your auth config
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(hashBuffer).toString("hex");
}

export async function signUp(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    // Use the Web Crypto API instead of bcrypt
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "user",
      },
    });

    if (!user) {
      return { error: "Failed to create account" };
    }

    // Automatically sign in after successful signup
    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      return { error: "Account created, but automatic login failed." };
    }

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Failed to create account. Please try again later." };
  }
}

export async function handleOAuthLogin(
  provider: string,
  providerId: string,
  profile: { email?: string; name?: string },
) {
  try {
    // First check if we already have this account
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: providerId,
        },
      },
      include: {
        user: true,
      },
    });

    // If we have this account, return the associated user
    if (existingAccount) {
      return { success: true, user: existingAccount.user };
    }

    // Check if we have a user with this email
    const email = profile.email || `${providerId}@${provider}.example`;
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If no user exists yet, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: profile.name || "User",
          email,
          role: "user",
        },
      });
    }

    // Create the account and link it to our user
    await prisma.account.create({
      data: {
        userId: user.id,
        provider,
        providerAccountId: providerId,
        type: "oauth",
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("OAuth login error:", error);
    return { error: "Failed to handle OAuth login." };
  }
}
