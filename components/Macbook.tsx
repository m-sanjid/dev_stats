"use client";
import React, { useState } from "react";
import * as motion from "motion/react-client";
import DeveloperDashboard from "./Github/Dashboard";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Link from "next/link";

function Macbook() {
  const [isHovered, setIsHovered] = useState(true);

  return (
    <motion.div
      className="relative text-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {" "}
      <motion.div
        className={`flex justify-center text-3xl font-bold text-white `}
        animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? 10 : 180 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <h1 className="border border-purple-400 bg-purple-400/40 text-purple-800 backdrop-blur px-8 py-2 rounded-full dark:bg-purple-400/20 dark:text-white ">
          Hover Me
        </h1>
      </motion.div>
      <motion.div className="mt-5 h-[400px] flex flex-col justify-center items-center w-full max-w-4xl mx-auto">
        <motion.div
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          style={{
            perspective: 1500,
            transformOrigin: "bottom",
          }}
          animate={{
            rotateX: isHovered ? 0 : -80,
            boxShadow: isHovered
              ? "0px 10px 20px rgba(0, 0, 0, 0.3)"
              : "0px 20px 40px rgba(0, 0, 0, 0.6), 0px 5px 15px rgba(0, 255, 255, 0.2)",
          }}
          transition={{
            rotateX: { duration: 0.8, ease: "easeInOut" },
            boxShadow: { duration: 0.5, ease: "easeInOut" },
          }}
          className={`border-[2px] transition-all ease-in-out w-[80%] ${isHovered ? "" : ""
            } rounded-t-2xl border-[#262627] border-b-0 bg-black h-[400px]`}
        >
          {/* Screen */}
          <div className="flex justify-center items-center rounded-t-2xl bg-gradient-to-br from-black via-gray-800 to-black border-[6px] border-black border-b-0 w-full h-full">
            {isHovered ? (
              <ScrollArea className="w-full h-full rounded-t-xl overflow-auto bg-gray-50 dark:bg-gray-800 box-content">
                <div className="">
                  <Link href="/preview">
                    <DeveloperDashboard />
                  </Link>
                </div>
                <ScrollBar
                  orientation="horizontal"
                  className="bg-gray-300 dark:bg-gray-700"
                />
              </ScrollArea>
            ) : (
              ""
            )}
            {/* Camera Notch */}
            <div className="absolute bg-black h-4 w-[80px] rounded-b-sm flex justify-center items-center top-0">
              <div className="bg-[#3E5A7B] w-1 h-1 rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* MacBook Bottom */}
        <div className="w-[95%] transition-all duration-700 ease-in-out">
          <div className="h-8 relative w-full bg-[#383839] rounded-b-md flex justify-center">
            <div className="absolute bg-[#4A4B4D] border-x-4 border-[#010101] blur-[1px] h-3 w-[17%] rounded-b-lg flex justify-center items-center top-0" />
            <div className="absolute h-[65%] w-3 left-0 bg-[#676A71] blur-[1px] rounded-b-xl border-x-2 mb-1 border-x-[#373838] mt-0" />
            <div className="absolute h-[65%] w-3 right-0 bg-[#676A71] blur-[1px] rounded-b-xl border-x-2 mb-1 border-x-[#373838] mt-0" />
            <div className="absolute bg-[#141415] border-x-2 border-black h-2 blur-sm w-full rounded-b-sm flex justify-center items-center bottom-1" />
            <div className="absolute bg-[#3E3F3F] border-x-2 border-black h-2 blur-sm w-full rounded-b-sm flex justify-center items-center bottom-0" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Macbook;
