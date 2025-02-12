"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface StatBadgeProps {
  icon: LucideIcon;
  value: number;
  label: string;
}

export function StatBadge({ icon: Icon, value, label }: StatBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 hover:text-purple-500 transition-colors cursor-help">
            <Icon className="h-4 w-4" />
            <span>{value.toLocaleString()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 