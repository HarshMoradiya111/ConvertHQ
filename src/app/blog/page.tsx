import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata = {
  title: "Blog | ConvertHQ",
  description: "Learn how to optimize your file conversion and compression workflows.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            ConvertHQ Blog
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400">
            Insights, guides, and tips for high-fidelity file processing.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <p className="text-slate-500">No posts published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="mr-2 size-4" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center text-primary font-semibold">
                  Read more <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
