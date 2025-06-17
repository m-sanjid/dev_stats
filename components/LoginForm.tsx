"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OAuthButton } from "./Buttons/OAuthButton";
import { GitHubIcon, GoogleIcon } from "./icons";
import { Button } from "./ui/button";
import { Link } from "next-view-transitions";
import { motion, Variants } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BorderDiv from "./BorderDiv";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

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

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        setError("root", { message: result.error });
      } else {
        router.push("/home");
        router.refresh(); // Ensure session updates
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <BorderDiv className="w-full max-w-md">
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="flex h-full w-full items-center justify-center"
      >
        <Card className="w-full rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center">DevStats</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Please sign in to continue. <span>|</span>
              <Link href="/signup">
                <Button variant="link" className="ml-1 h-auto p-0">
                  signup?
                </Button>
              </Link>
            </p>
          </CardHeader>

          <CardContent>
            <motion.div variants={item} className="space-y-2">
              <OAuthButton provider="google">
                <GoogleIcon className="h-5 w-5" />
                Sign in with Google
              </OAuthButton>

              <OAuthButton provider="github">
                <GitHubIcon className="h-5 w-5" />
                Sign in with GitHub
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
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </motion.form>
          </CardContent>
        </Card>
      </motion.main>
    </BorderDiv>
  );
}
