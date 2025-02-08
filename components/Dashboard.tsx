import Image from "next/image";
import React from "react";

function Dashboard() {
  return (
    <section className="flex flex-col gap-4 items-center my-10">
      <h2 className="font-bold text-4xl">
        Live <span className="text-purple-300">Dashboard</span> Preview
      </h2>
      <p className="text-2xl text-slate-500">
        Get real-time insights to your work
      </p>
      <div className="contain-content border-[10px] border-black shadow-md rounded-lg ">
        <Image
          src={"/dashboard.png"}
          className="rounded-lg"
          width={800}
          height={400}
          alt="dashboard"
        />
      </div>
    </section>
  );
}

export default Dashboard;
