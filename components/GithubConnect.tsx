"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Github } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface GitHubConnectProps {
  hasGithubToken: boolean;
  // Remove onConnect prop since we'll handle it inside the component
}

export const GithubConnect: React.FC<GitHubConnectProps> = ({
  hasGithubToken,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await signIn("github", {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        console.error("GitHub connection failed: ", result.error);
      } else {
        // Instead of calling an external onConnect handler,
        // you can trigger a router refresh or any other client-side effect
        router.refresh();
      }
    } catch (error) {
      console.error("Error connecting to GitHub: ", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          GitHub Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasGithubToken ? (
          <div className="text-green-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full" />
            Connected to GitHub
          </div>
        ) : (
          <div>
            <p className="mb-4">
              Connect your GitHub account to track your coding activity
            </p>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Connect GitHub"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
