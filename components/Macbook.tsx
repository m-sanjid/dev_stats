"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
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
        className={`flex justify-center text-3xl font-bold text-white`}
        animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? 10 : 180 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <h1 className="rounded-full border border-purple-400 bg-purple-400/40 px-8 py-2 text-purple-800 backdrop-blur dark:bg-purple-400/20 dark:text-white">
          Hover Me
        </h1>
      </motion.div>
      <motion.div className="mx-auto mt-5 flex h-[400px] w-full max-w-4xl flex-col items-center justify-center">
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
          className={`w-[80%] border-[2px] transition-all ease-in-out ${
            isHovered ? "" : ""
          } h-[400px] rounded-t-2xl border-b-0 border-[#262627] bg-black`}
        >
          {/* Screen */}
          <div className="flex h-full w-full items-center justify-center rounded-t-2xl border-[6px] border-b-0 border-black bg-gradient-to-br from-black via-neutral-800 to-black">
            {isHovered ? (
              <ScrollArea className="box-content h-full w-full overflow-auto rounded-t-xl bg-neutral-50 dark:bg-neutral-800">
                <div className="">
                  <Link href="/preview">
                    <DeveloperDashboard />
                  </Link>
                </div>
                <ScrollBar
                  orientation="horizontal"
                  className="bg-neutral-300 dark:bg-neutral-700"
                />
              </ScrollArea>
            ) : (
              ""
            )}
            {/* Camera Notch */}
            <div className="absolute top-0 flex h-4 w-[80px] items-center justify-center rounded-b-sm bg-black">
              <div className="h-1 w-1 rounded-full bg-[#3E5A7B]"></div>
            </div>
          </div>
        </motion.div>

        {/* MacBook Bottom */}
        <div className="w-[95%] transition-all duration-700 ease-in-out">
          <div className="relative flex h-8 w-full justify-center rounded-b-md bg-[#383839]">
            <div className="absolute top-0 flex h-3 w-[17%] items-center justify-center rounded-b-lg border-x-4 border-[#010101] bg-[#4A4B4D] blur-[1px]" />
            <div className="absolute left-0 mb-1 mt-0 h-[65%] w-3 rounded-b-xl border-x-2 border-x-[#373838] bg-[#676A71] blur-[1px]" />
            <div className="absolute right-0 mb-1 mt-0 h-[65%] w-3 rounded-b-xl border-x-2 border-x-[#373838] bg-[#676A71] blur-[1px]" />
            <div className="absolute bottom-1 flex h-2 w-full items-center justify-center rounded-b-sm border-x-2 border-black bg-[#141415] blur-sm" />
            <div className="absolute bottom-0 flex h-2 w-full items-center justify-center rounded-b-sm border-x-2 border-black bg-[#3E3F3F] blur-sm" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Macbook;
