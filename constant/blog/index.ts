import Blog1 from "./blog1.mdx";
import Blog2 from "./blog2.mdx";
import Blog3 from "./blog3.mdx";

export const blogPosts = [
  {
    id: 1,
    title: "Getting Started with GitHub Analytics",
    excerpt:
      "Learn how to leverage GitHub metrics to improve your development workflow and showcase your skills.",
    author: "DevStats Team",
    date: "2024-03-15",
    readTime: "5 min read",
    category: "Tutorial",
    image: "/blog-1.jpeg",
    content: Blog1,
  },
  {
    id: 2,
    title: "Maximizing Your Developer Portfolio",
    excerpt:
      "Tips and strategies for creating an impressive developer portfolio that stands out to employers.",
    author: "Sarah Johnson",
    date: "2024-03-10",
    readTime: "8 min read",
    category: "Career Growth",
    image: "/blog-2.jpeg",
    content: Blog2,
  },
  {
    id: 3,
    title: "Understanding Your Coding Metrics",
    excerpt:
      "Deep dive into what different coding metrics mean and how to use them for personal growth.",
    author: "Michael Chen",
    date: "2024-03-05",
    readTime: "6 min read",
    category: "Analytics",
    image: "/blog-3.jpeg",
    content: Blog3,
  },
];
