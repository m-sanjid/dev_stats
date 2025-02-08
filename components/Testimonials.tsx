import { User } from "lucide-react";
import React from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Full Stack Developer",
    content:
      "DevProof has been a game-changer for my job search. It beautifully showcases all my contributions across different platforms, giving potential employers a comprehensive view of my skills.",
    avatar: (
      <User
        height={40}
        width={40}
        strokeWidth={"small"}
        className="bg-gray-200 rounded-lg"
      />
    ),
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content:
      "I love how DevProof aggregates all my work into one sleek portfolio. It's saved me hours of manual work and has definitely helped me stand out in job applications.",
    avatar: (
      <User
        height={40}
        width={40}
        strokeWidth={"small"}
        className="bg-gray-200 rounded-lg"
      />
    ),
  },
  {
    name: "Emily Rodriguez",
    role: "Frontend Developer",
    content:
      "The analytics provided by DevProof are incredibly insightful. It's helped me identify areas where I can improve and highlight my strengths to potential employers.",
    avatar: (
      <User
        height={40}
        width={40}
        strokeWidth={"small"}
        className="bg-gray-200 rounded-lg"
      />
    ),
  },
];

function Testimonials() {
  return (
    <section className="px-4 py-10 my-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-20">testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((p) => (
            <div
              key={p.name}
              className="shadow-xl p-6 mx-4 rounded-xl border border-slate-200 hover:shadow-2xl hover:shadow-blue-400 hover:scale-110"
            >
              <div className="flex items-center">
                {p.avatar}
                <span className="font-semibold text-xl ml-2 px-2">
                  {p.name}
                </span>
              </div>

              <p className="py-2 mb-2 text-slate-500">{p.role}</p>
              <p>{p.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
