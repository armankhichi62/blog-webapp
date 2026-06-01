"use client";

import { useEffect, useState } from "react";
import api from "../services/api";

const getAuthor = (blog: any) => blog.author?.name || blog.authorName || "Inkwell writer";
const getDate = (blog: any) => {
  const value = blog.publishedAt || blog.createdAt;
  return value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently published";
};
const getCommentCount = (blog: any) => blog.commentsCount ?? blog.comments?.length ?? 0;

export default function Home() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blog/published");
        setBlogs(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <main className="page-shell">
      <section className="relative overflow-hidden border-b border-slate-200/80 px-6 py-20 text-center sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/80 to-white" />
        <div className="absolute left-1/2 top-16 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-3xl animate-fade-up stagger-1">
          <span className="eyebrow mb-5 inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-2 shadow-sm">
            A space for thoughtful ideas
          </span>
          <h1 className="mb-5 text-5xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
            Stories worth reading.
            <span className="block text-blue-600">Ideas worth sharing.</span>
          </h1>
          <p className="mx-auto mb-9 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Discover useful perspectives, practical guides, and honest writing from a growing community of creators.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/blogs" className="primary-button px-6 py-3.5 text-sm">
              Explore latest stories
            </a>
            <a href="/author/register" className="secondary-button px-6 py-3.5 text-sm">
              Start writing
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Featured writing</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
              Latest stories
            </h2>
          </div>
          <a href="/blogs" className="hidden text-sm font-bold text-blue-600 hover:text-blue-700 sm:block">
            View all posts &rarr;
          </a>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-blue-600">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        ) : blogs.length === 0 ? (
          <div className="surface-card p-12 text-center animate-fade-up stagger-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
            </div>
            <p className="mb-1 font-bold text-slate-900">The first story is waiting to be written</p>
            <p className="text-sm text-slate-500">Start the conversation with a useful idea.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {blogs.slice(0, 6).map((blog, index) => (
              <article
                key={blog._id}
                className="surface-card surface-card-hover flex min-h-64 flex-col p-6 animate-fade-up sm:p-7"
                style={{ animationDelay: `${(index + 3) * 0.05}s`, opacity: 0 }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {blog.category || "Featured"}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{getDate(blog)}</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold leading-snug text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  {blog.title}
                </h3>
                <p className="line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{blog.content}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      {getAuthor(blog).charAt(0).toUpperCase()}
                    </span>
                    {getAuthor(blog)}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {blog.likes ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
                      {getCommentCount(blog)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
