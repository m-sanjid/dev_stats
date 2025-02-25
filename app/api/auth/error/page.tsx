import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription className="mt-2">
            There was a problem signing you in. Please try again or contact
            support if the problem persists.
          </AlertDescription>
          <div className="mt-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-primary hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </Alert>
      </div>
    </div>
  );
}
