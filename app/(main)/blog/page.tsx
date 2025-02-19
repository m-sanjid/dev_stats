import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, User, Tag } from "lucide-react";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "Getting Started with GitHub Analytics",
    excerpt: "Learn how to leverage GitHub metrics to improve your development workflow and showcase your skills.",
    author: "DevStats Team",
    date: "2024-03-15",
    readTime: "5 min read",
    category: "Tutorial",
    image: "/blog/github-analytics.jpg"
  },
  {
    id: 2,
    title: "Maximizing Your Developer Portfolio",
    excerpt: "Tips and strategies for creating an impressive developer portfolio that stands out to employers.",
    author: "Sarah Johnson",
    date: "2024-03-10",
    readTime: "8 min read",
    category: "Career Growth",
    image: "/blog/portfolio.jpg"
  },
  {
    id: 3,
    title: "Understanding Your Coding Metrics",
    excerpt: "Deep dive into what different coding metrics mean and how to use them for personal growth.",
    author: "Michael Chen",
    date: "2024-03-05",
    readTime: "6 min read",
    category: "Analytics",
    image: "/blog/metrics.jpg"
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="DevStats Blog"
        description="Insights, tutorials, and updates from the DevStats team"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Tag className="h-4 w-4" />
                  <span>{post.category}</span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
