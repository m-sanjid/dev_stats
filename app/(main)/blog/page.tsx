"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, User, Tag } from "lucide-react";
import { Link } from "next-view-transitions";
import { motion } from "motion/react";
import { blogPosts } from "@/constant/blog";
import Image from "next/image";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <PageHeader
          title="DevStats Blog"
          description="Insights, tutorials, and updates from the DevStats team"
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, idx) => (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              key={post.id}
            >
              <Link href={`/blog/${post.id}`}>
                <Card className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-2 hover:border-primary/20 hover:shadow-xl dark:hover:border-primary/10">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={500}
                      height={500}
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Tag className="h-4 w-4 transition-colors group-hover:text-primary" />
                      <span className="transition-colors group-hover:text-primary">
                        {post.category}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-xl transition-all duration-300 group-hover:translate-x-1">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 line-clamp-3 text-muted-foreground transition-all duration-300 group-hover:text-primary">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 transition-colors group-hover:text-foreground/80">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-4 transition-colors group-hover:text-foreground/80">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {new Date(post.date).toLocaleDateString()}
                          </span>
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
