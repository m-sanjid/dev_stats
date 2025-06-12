import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const ProOnlyComponent = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center rounded-md bg-white/10 p-40 shadow-md backdrop-blur-sm">
        <div>Only for pro users</div>
        <Link href={"/pricing"}>
          <Button className="mt-4 bg-purple-500">Subcribe to Pro</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProOnlyComponent;
