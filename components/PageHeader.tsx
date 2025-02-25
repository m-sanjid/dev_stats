import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBack?: boolean;
  backUrl?: string;
  gradient?: boolean;
}

export function PageHeader({
  title,
  description,
  showBack = true,
  backUrl = "/dashboard",
  gradient = true,
}: PageHeaderProps) {
  return (
    <div className="max-w-4xl w-full mx-auto border-b bg-background/95 backdrop-blur pl-8 supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {showBack && (
          <Button variant="ghost" asChild className="mr-4 h-8 w-8 p-0">
            <Link href={backUrl}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
        )}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1">
            <h1
              className={`text-lg font-semibold ${
                gradient
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                  : "text-foreground"
              }`}
            >
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
