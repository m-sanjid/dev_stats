import { ReactNode } from "react";
import { Button } from "../ui/button";

export const PrimaryButton = ({
  children,
  onClick,
  size = "small",
}: {
  children: ReactNode;
  onClick: () => void;
  size?: "big" | "small";
}) => {
  return (
    <Button
      onClick={onClick}
      className={`${size === "small" ? "text-md" : "text-xl"} ${size === "small" ? "px-8 py-2" : "px-8 py-4"} cursor-pointer text-center hover:shadow-md rounded-3xl bg-purple-500`}
    >
      {children}
    </Button>
  );
};
