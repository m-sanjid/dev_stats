import React from "react";
import PreviewImg from "./PreviewImg";
import PreviewImg2 from "./PreviewImg2";

function PreviewCard() {
  return (
    <div
      className="flex h-full items-center justify-between gap-8"
      style={{ perspective: 1200 }}
    >
      <div
        className="relative mt-12 scale-75 transition-transform duration-500 ease-in-out"
        style={{
          transform: "rotateY(25deg) translateZ(50px)",
        }}
      >
        <PreviewImg skew={""} />
      </div>

      <div
        className="relative scale-75 transition-transform duration-500 ease-in-out"
        style={{
          transform: "rotateY(-25deg) translateZ(-50px)",
        }}
      >
        <PreviewImg2 />
      </div>
    </div>
  );
}

export default PreviewCard;
