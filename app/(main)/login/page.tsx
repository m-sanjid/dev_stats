import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any;
}) {
  // Check if user is already authenticated
  const session = await auth();
  if (session) {
    redirect("/home");
  }

  const error = searchParams.error;
  let errorMessage = null;
  if (error === "OAuthAccountNotLinked") {
    errorMessage = "This GitHub account is already linked to another user. Please sign in with the original method or contact support.";
  }

  return (
    <div className="relative h-[calc(80vh-100px)] w-full">
      <div
        className="fixed inset-0 bg-white/90 dark:bg-black/90"
        style={{
          backgroundImage: `
      linear-gradient(transparent 7px, rgb(151,163,173,0.5) 7px, rgb(151,163,173,0.5) 1px, transparent 8px),
      linear-gradient(90deg, transparent 7px,rgb(151,163,173,0.5)  7px, rgb(151,163,173,0.5) 1px, transparent 8px)
    `,
          backgroundSize: "40px 40px",
          backgroundRepeat: "repeat",
        }}
      />
        <div
          className="fixed inset-0 bg-white/10 backdrop-blur-[1px] dark:bg-black/10"
          aria-hidden="true"
        />

        {/* Show error message if present */}
        {error && error !== "OAuthAccountNotLinked" && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error === "Configuration"
              ? "There was a problem with the authentication configuration. Please try again."
              : "An error occurred during sign in. Please try again."}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
            {errorMessage}
          </div>
        )}
        <div className="relative flex h-full w-full items-center justify-center">
          <LoginForm />
        </div>
      {/* </div> */}
    </div>
  );
}
