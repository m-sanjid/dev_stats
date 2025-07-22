import { Metadata } from "next";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { CalendarDays, Clock, User, Tag, ArrowLeft } from "lucide-react";
import { Link } from "next-view-transitions";
import { blogPosts } from "@/constant/blog";
import MotionDiv from "@/components/MotionDiv";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const post = blogPosts.find((p) => String(p.id) === slug);
  if (!post) {
    return {
      title: "Blog Post Not Found | DevStats",
      description: "The requested blog post could not be found.",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${post.title} | DevStats Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
    },
  };
}

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params?.slug;

  const post = useMemo(() => {
    if (!slug) return null;
    const id = Array.isArray(slug) ? slug[0] : slug;
    return blogPosts.find((p) => String(p.id) === id);
  }, [slug]);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">Blog post not found</h2>
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-primary hover:underline"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto flex max-w-4xl items-center gap-4 px-4 py-10">
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary hover:underline"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </div>
      </MotionDiv>
      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="container mx-auto max-w-4xl px-4 py-12"
      >
        <div className="mb-8">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src={post.image}
              alt={post.title}
              className="mb-8 aspect-video w-full rounded-3xl object-cover shadow-xl"
              width={1000}
              height={1000}
            />
          </MotionDiv>
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Tag className="h-4 w-4" /> {post.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              <User className="h-4 w-4" /> {post.author}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              <CalendarDays className="h-4 w-4" />{" "}
              {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Clock className="h-4 w-4" /> {post.readTime}
            </span>
          </div>
          <h1 className="mb-4 text-2xl font-bold md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">{post.excerpt}</p>
        </div>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <post.content />
        </MotionDiv>
      </MotionDiv>
    </div>
  );
}
