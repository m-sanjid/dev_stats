import React from "react";
import { Button } from "./ui/button";
import { Link } from "next-view-transitions";
import BorderDiv from "./BorderDiv";

const LoginCTA = () => {
  return (
    <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
      <BorderDiv>
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-card p-8 dark:bg-accent">
          <div>Please Sign in to view this page</div>
          <Link className="mx-8 w-full" href={"/signin"}>
            <Button className="w-full">Signin</Button>
          </Link>
        </div>
      </BorderDiv>
    </div>
  );
};

export default LoginCTA;
