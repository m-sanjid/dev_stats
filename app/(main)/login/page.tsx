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

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-white/90 dark:bg-black/90"
        style={{
          backgroundImage: `
      linear-gradient(transparent 7px, rgb(151,163,173,0.5) 7px, rgb(151,163,173,0.5) 3px, transparent 8px),
      linear-gradient(90deg, transparent 7px,rgb(151,163,173,0.5)  7px, rgb(151,163,173,0.5) 3px, transparent 8px)
    `,
          backgroundSize: "40px 40px",
          backgroundRepeat: "repeat",
        }}
      >
        <div
          className="absolute inset-0 bg-white/10 backdrop-blur-[1px] dark:bg-black/10"
          aria-hidden="true"
        />

        {/* Show error message if present */}
        {searchParams.error && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {searchParams.error === "Configuration"
              ? "There was a problem with the authentication configuration. Please try again."
              : "An error occurred during sign in. Please try again."}
          </div>
        )}
        <div className="relative flex h-full w-full items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
