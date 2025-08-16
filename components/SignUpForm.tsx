"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { OAuthButton } from "./Buttons/OAuthButton";
import { GitHubIcon, GoogleIcon } from "./icons";
import { signUp } from "@/actions/auth";
import { Button } from "./ui/button";
import { motion, Variants } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BorderDiv from "./BorderDiv";
import { useMutation } from "@tanstack/react-query";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
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
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const result = await signUp(data);
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      router.push("/home");
    },
    onError: (error: Error) => {
      setError("root", {
        message: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate(data);
  };

  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full w-full items-center justify-center"
    >
      <BorderDiv className="my-10 w-full max-w-md">
        <Card className="w-full rounded-2xl">
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

              <Button
                type="submit"
                disabled={signUpMutation.isPending}
                className="w-full"
              >
                {signUpMutation.isPending ? "Signing up..." : "Sign Up"}
              </Button>
            </motion.form>
          </CardContent>
        </Card>
      </BorderDiv>
    </motion.main>
  );
}
