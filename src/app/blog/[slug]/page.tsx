import { getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: `${post.title} | ConvertHQ Blog`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-12 transition-colors"
        >
          <ArrowLeft className="mr-2 size-4" /> Back to blog
        </Link>

        <div className="mb-12 space-y-4">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="mr-2 size-4" />
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed italic">
            {post.description}
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">
          <MDXRemote source={post.content} />
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl text-center space-y-6">
            <h3 className="text-2xl font-bold">Ready to optimize your workflow?</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Start converting your files with ConvertHQ today and experience high-fidelity processing.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/convert"
                className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Start Converting Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
