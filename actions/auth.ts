"use server";

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { signIn } from "@/auth";

const prisma = new PrismaClient();

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

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "user",
      },
    });
    console.log(user);

    // Automatically sign in after successful signup
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Failed to create account" };
  }
}
