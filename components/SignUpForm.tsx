"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { OAuthButton } from "./Buttons/OAuthButton";
import { GithubIcon } from "lucide-react";
import { GitHubIcon, GoogleIcon } from "./icons";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

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
        router.push("/dashboard");
      }
    } catch (error) {
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <main className="h-svh flex justify-center items-center">
      <div className="flex flex-col justify-center items-center border-white rounded-xl px-8 shadow-md border-2 bg-red-400 ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-blue-200 p-4"
        >
          <div className="bg-blue-200 w-full my-4">DEVSTATS</div>
          <div className="text-xs">
            <h4 className="text-center text-gray-400">
              Welcome back! Please sign in to continue
            </h4>
          </div>

          <div className="space-y-2">
            <OAuthButton provider="google">
              <GoogleIcon className="w-4 h-4" />
              Sign up with Google
            </OAuthButton>

            <OAuthButton provider="github">
              <GitHubIcon className="w-4 h-4" />
              Sign up with GitHub
            </OAuthButton>
          </div>

          <div className="text-xs">
            <h4 className="text-center">Or continue with</h4>
          </div>

          <div>
            <label htmlFor="name">Name</label>
            <input
              {...register("name")}
              id="name"
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-red-500 text-sm">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </main>
  );
}
