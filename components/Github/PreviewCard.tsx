import React from "react";
import PreviewImg from "./PreviewImg";
import PreviewImg2 from "./PreviewImg2";

function PreviewCard() {
  return (
    <div
      className="h-full flex justify-between gap-8 items-center"
      style={{ perspective: 1200 }}
    >
      <div
        className="relative scale-75 mt-12 transition-transform duration-500 ease-in-out"
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
