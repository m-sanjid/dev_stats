import React from "react";
import { Button } from "../ui/button";

function SigninButton({
  isLoggedIn,
  onClick,
}: {
  isLoggedIn: boolean;
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick} className="bg-blue-600">
      {isLoggedIn ? "Log Out" : "Log in"}
    </Button>
  );
}

export default SigninButton;
