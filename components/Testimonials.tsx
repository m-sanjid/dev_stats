"use client";

import { User, Star, Quote } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { CardContainer } from "./ui/card-container";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Full Stack Developer",
    company: "Tech Innovators",
    rating: 5,
    content:
      "DevStats has been a game-changer for my job search. It beautifully showcases all my contributions across different platforms, giving potential employers a comprehensive view of my skills.",
    avatar: "/avatars/sarah.jpg",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    company: "StartupX",
    rating: 4,
    content:
      "I love how DevStats aggregates all my work into one sleek portfolio. It's saved me hours of manual work and has definitely helped me stand out in job applications.",
    avatar: "/avatars/michael.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Frontend Developer",
    company: "DesignCraft",
    rating: 5,
    content:
      "The analytics provided by DevStats are incredibly insightful. It's helped me identify areas where I can improve and highlight my strengths to potential employers.",
    avatar: "/avatars/emily.jpg",
  },
  {
    name: "Alex Thompson",
    role: "DevOps Engineer",
    company: "CloudTech",
    rating: 4,
    content:
      "The integration with multiple platforms is seamless. I can showcase my contributions from GitHub, GitLab, and Stack Overflow all in one place.",
    avatar: "/avatars/alex.jpg",
  },
  {
    name: "Priya Patel",
    role: "Backend Developer",
    company: "DataFlow",
    rating: 5,
    content:
      "The custom portfolio feature is amazing. I can highlight my best projects and achievements in a way that really catches recruiters' attention.",
    avatar: "/avatars/priya.jpg",
  },
  {
    name: "David Kim",
    role: "Mobile Developer",
    company: "AppWorks",
    rating: 4,
    content:
      "DevStats has helped me track my progress and growth as a developer. The insights and analytics are invaluable for personal development.",
    avatar: "/avatars/david.jpg",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Testimonials() {
  return (
    <section className="container max-w-7xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Loved by Developers
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Join thousands of developers who've enhanced their professional
          presence
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div key={testimonial.name} variants={item} className="h-full">
            <CardContainer className="h-full flex flex-col">
              <div className="flex flex-col gap-4 h-full">
                {/* Quote Icon */}
                <div className="text-purple-500 dark:text-purple-400">
                  <Quote size={24} />
                </div>

                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 flex-grow">
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </CardContainer>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
export default Testimonials;
