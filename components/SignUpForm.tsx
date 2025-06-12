"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { OAuthButton } from "./Buttons/OAuthButton";
import { GitHubIcon, GoogleIcon } from "./icons";
import { signUp } from "@/actions/auth";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export function SignUpForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signUp(data);
      if (result?.error) {
        setError("root", { message: result.error });
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-screen w-[50%] items-center justify-center"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">DevStats</CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Welcome! Please sign up to continue.
          </p>
        </CardHeader>

        <CardContent>
          <motion.div variants={item} className="space-y-2">
            <OAuthButton provider="google">
              <GoogleIcon className="h-5 w-5" />
              Sign up with Google
            </OAuthButton>

            <OAuthButton provider="github">
              <GitHubIcon className="h-5 w-5" />
              Sign up with GitHub
            </OAuthButton>
          </motion.div>

          <motion.div
            variants={item}
            className="my-3 text-center text-sm text-muted-foreground"
          >
            Or
          </motion.div>

          <motion.form
            variants={item}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errors.root?.message && (
              <p
                className="text-center text-sm text-destructive"
                aria-live="polite"
              >
                {errors.root.message}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          </motion.form>
        </CardContent>
      </Card>
    </motion.main>
  );
}
