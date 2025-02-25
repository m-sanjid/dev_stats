import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const ProOnlyComponent = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-md shadow-md p-40">
        <div>Only for pro users</div>
        <Link href={"/pricing"}>
          <Button className="mt-4 bg-purple-500">Subcribe to Pro</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProOnlyComponent;
