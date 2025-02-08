"use client";
import React, { useState } from "react";
import SigninButton from "./Buttons/SigninButton";
import { PrimaryButton } from "./Buttons/PrimaryButton";

function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="px-10 md:px-28 lg:px-44 xl:px-56 flex mt-24 flex-col items-center">
      <div className="flex flex-col justify-around mt-7 items-center">
        <h1 className="text-6xl font-extrabold text-center">
          Your Coding Journey
          <span className="text-purple-300"> Quantified</span>
        </h1>
        <p>Transfrom your GitHub activity into compelling proof of work</p>
      </div>
      <div className="flex gap-5 mt-6">
        <PrimaryButton size="big" onClick={() => setIsLoggedIn(!isLoggedIn)}>
          GET STARTED
        </PrimaryButton>
        <SigninButton
          isLoggedIn={isLoggedIn}
          onClick={() => setIsLoggedIn(!isLoggedIn)}
        />
      </div>
      <div className="bg-white border-black border-4 rounded-lg shadow-md py-32 px-40 m-5">
        Animation
      </div>
    </div>
  );
}

export default Hero;
