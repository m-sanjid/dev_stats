import { Link } from "next-view-transitions";
import React from "react";
import { Button } from "./ui/button";
import BorderDiv from "./BorderDiv";

const ProOnlyComponent = () => {
  return (
    <div className="flex items-center justify-center">
      <BorderDiv>
        <div className="flex flex-col items-center rounded-2xl border bg-white p-40 dark:bg-black">
          <div>Only for pro users</div>
          <Link href={"/pricing"}>
            <Button className="mt-4">Subcribe to Pro</Button>
          </Link>
        </div>
      </BorderDiv>
    </div>
  );
};

export default ProOnlyComponent;
