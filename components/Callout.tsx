import { ReactNode } from "react";

interface CalloutProps {
  children: ReactNode;
}

export function Callout({ children }: CalloutProps) {
  return (
    <div className="my-6 rounded-lg border border-l-4 border-primary bg-muted p-4">
      {children}
    </div>
  );
}
