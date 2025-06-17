import { ArrowLeft } from "lucide-react";
import { Link } from "next-view-transitions";
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
    <div className="mx-auto w-full max-w-4xl border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 max-w-screen-2xl items-center">
        {showBack && (
          <Button
            variant="ghost"
            asChild
            className="mr-4 hidden h-8 w-8 p-0 md:flex"
          >
            <Link href={backUrl}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
        )}
        <div className="ml-14 flex flex-1 items-center justify-between space-x-2 md:ml-0 md:justify-end">
          <div className="w-full flex-1 items-center">
            <h1
              className={`text-lg font-semibold ${
                gradient ? "text-primary" : "text-foreground"
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
