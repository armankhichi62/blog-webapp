"use client";

import { useEffect, useState } from "react";
import api from "../services/api";

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
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Hero */}
      <div
        className="relative overflow-hidden border-b px-6 py-20 text-center"
        style={{ borderColor: "var(--bg-border)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,166,35,0.06), transparent)",
          }}
        />
        <div className="relative max-w-2xl mx-auto animate-fade-up stagger-1">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--accent)" }}
          >
            Inkwell Blog Platform
          </p>
          <h1
            className="text-5xl font-semibold leading-tight mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Stories worth reading
          </h1>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Discover thoughtful writing from our community of writers.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/blogs"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "var(--accent)", color: "#0d0f14" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--accent-dim)"}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "var(--accent)"}
            >
              Browse all posts
            </a>
            <a
              href="/dashboard/create"
              className="px-6 py-3 rounded-xl text-sm font-semibold border transition-all"
              style={{ color: "var(--text-secondary)", borderColor: "var(--bg-border)", background: "transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              Start writing
            </a>
          </div>
        </div>
      </div>

      {/* Blog grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2
          className="text-lg font-semibold mb-6 animate-fade-up stagger-2"
          style={{ color: "var(--text-primary)" }}
        >
          Latest posts
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          </div>
        ) : blogs.length === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center animate-fade-up stagger-2"
            style={{ background: "var(--bg-surface)", borderColor: "var(--bg-border)" }}
          >
            <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>No posts published yet</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Be the first to share something</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.map((blog, i) => (
              <div
                key={blog._id}
                className="rounded-2xl border p-6 transition-all duration-200 animate-fade-up"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--bg-border)",
                  animationDelay: `${(i + 3) * 0.05}s`,
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {blog.category && (
                  <span
                    className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg mb-3"
                    style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
                  >
                    {blog.category}
                  </span>
                )}
                <h2
                  className="text-base font-semibold mb-2 leading-snug"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  {blog.title}
                </h2>
                <p
                  className="text-sm line-clamp-3 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {blog.content}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {blog.likes ?? 0}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
                  >
                    {blog.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
