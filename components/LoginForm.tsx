"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OAuthButton } from "./Buttons/OAuthButton";
import { GitHubIcon, GoogleIcon } from "./icons";
import { Button } from "./ui/button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

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
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <main className="flex w-[70%] xl:w-[30%] justify-center items-center">
      <div className="w-full max-w-md bg-white dark:bg-black dark:border dark:border-neutral-700 shadow-lg rounded-lg p-8">
        <h2 className="font-bold text-xl text-center py-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          DevStats
        </h2>
        <p className="text-center text-gray-500 dark:text-neutral-500 text-sm mb-4">
          Please sign in to continue.
        </p>

        {/* OAuth Buttons */}
        <div className="space-y-2">
          <OAuthButton provider="google">
            <GoogleIcon className="w-5 h-5" />
            Sign in with Google
          </OAuthButton>

          <OAuthButton provider="github">
            <GitHubIcon className="w-5 h-5" />
            Sign in with GitHub
          </OAuthButton>
        </div>

        <div className="text-center text-gray-400 dark:text-neutral-500 my-3 text-sm">
          Or
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            id="email"
            label="Email"
            type="email"
            register={register}
            error={errors.email?.message}
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            register={register}
            error={errors.password?.message}
          />

          {errors.root?.message && (
            <p className="text-red-500 text-sm text-center" aria-live="polite">
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full dark:bg-neutral-600 text-white p-2 mt-4 rounded-md hover:bg-purple-600 disabled:bg-gray-400"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}

function InputField({
  id,
  label,
  type,
  register,
  error,
}: {
  id: string;
  label: string;
  type: string;
  register: any;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-neutral-400"
      >
        {label}
      </label>
      <input
        {...register(id)}
        id={id}
        type={type}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring dark:bg-neutral-400 focus:ring-purple-200"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="text-red-500 text-sm mt-1"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}
