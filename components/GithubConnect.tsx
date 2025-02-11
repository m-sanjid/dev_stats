"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Github, Check, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GithubConnectProps {
  hasGithubToken: boolean;
}

export function GithubConnect({ hasGithubToken }: GithubConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await signIn("github", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Failed to connect to GitHub:", error);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {hasGithubToken ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400"
                disabled
              >
                <Check className="mr-2 h-4 w-4" />
                GitHub Connected
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your GitHub account is successfully connected</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="relative">
            <Tooltip open={showTooltip}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="bg-[#24292F] hover:bg-[#24292F]/90 dark:bg-[#24292F]/80 dark:hover:bg-[#24292F]/70"
                >
                  {isConnecting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Github className="mr-2 h-4 w-4" />
                  )}
                  {isConnecting ? "Connecting..." : "Connect GitHub"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-red-50 border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <p>Failed to connect. Please try again.</p>
                </div>
              </TooltipContent>
            </Tooltip>

            <AnimatePresence>
              {!hasGithubToken && !isConnecting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 text-xs text-gray-600 dark:text-gray-400"
                >
                  Connect to see your GitHub stats
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}
