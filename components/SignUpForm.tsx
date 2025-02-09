"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { OAuthButton } from "./Buttons/OAuthButton";
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
      console.error("Sign-up error:", error);
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <main className="h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-center text-lg font-bold mb-4">DEVSTATS</h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          Welcome! Please sign up to continue.
        </p>

        <div className="space-y-2">
          <OAuthButton provider="google">
            <GoogleIcon className="w-5 h-5" />
            Sign up with Google
          </OAuthButton>

          <OAuthButton provider="github">
            <GitHubIcon className="w-5 h-5" />
            Sign up with GitHub
          </OAuthButton>
        </div>

        <div className="text-center text-gray-400 my-3 text-sm">Or</div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            id="name"
            label="Name"
            type="text"
            register={register}
            error={errors.name?.message}
          />

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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...register(id)}
        id={id}
        type={type}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
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
