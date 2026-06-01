"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

export default function PendingBlogs() {

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});

  useRequireAuth();

  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blog/pending");
      setBlogs(res.data?.data || []);
    } catch (error: any) {
      setError(error.response?.data?.message || "Unable to load pending blogs.");
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const approveBlog = async (id: string) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: "approve" }));
      await api.put(`/blog/approve/${id}`, {});
      fetchBlogs();
    } catch (error: any) {
      console.log(error.response?.data);
    } finally {
      setActionLoading((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  const rejectBlog = async (id: string) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: "reject" }));
      await api.put(`/blog/reject/${id}`, {});
      fetchBlogs();
    } catch (error: any) {
      console.log(error.response?.data);
    } finally {
      setActionLoading((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 animate-fade-up stagger-1">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm mb-5 transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Dashboard
          </a>
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
            Moderation
          </p>
          <div className="flex items-end justify-between">
            <h1
              className="text-3xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Pending Blogs
            </h1>
            {!loading && (
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}
              >
                {blogs.length} awaiting review
              </span>
            )}
          </div>
        </div>

        {error && (
          <div
            className="rounded-2xl border p-5 mb-6 text-sm animate-fade-up"
            style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#b91c1c" }}
          >
            {error}
          </div>
        )}

        {/* Blog list */}
        {error ? (
          <div className="rounded-2xl border p-12 text-center animate-fade-up stagger-2" style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#b91c1c" }}>
            <p className="font-medium mb-1">Unable to load pending blogs.</p>
            <p className="text-sm">Please refresh the page or try again later.</p>
          </div>
        ) : loading ? (
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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--bg-elevated)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text-muted)" }}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>All clear!</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No posts waiting for review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog, i) => (
              <div
                key={blog._id}
                className="rounded-2xl border p-6 animate-fade-up"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--bg-border)",
                  animationDelay: `${(i + 2) * 0.05}s`,
                  opacity: 0,
                }}
              >
                {/* Top: title + meta */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}
                  >
                    {blog.title?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base mb-0.5" style={{ color: "var(--text-primary)" }}>
                      {blog.title}
                    </h2>
                    {blog.category && (
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{blog.category}</span>
                    )}
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}
                  >
                    Pending
                  </span>
                </div>

                {/* Content preview */}
                <p
                  className="text-sm line-clamp-3 mb-5 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {blog.content}
                </p>

                {/* Divider */}
                <div className="border-t mb-4" style={{ borderColor: "var(--bg-border)" }} />

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => approveBlog(blog._id)}
                    disabled={!!actionLoading[blog._id]}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                    style={{
                      background: "rgba(34,197,94,0.12)",
                      color: "#22c55e",
                      border: "1px solid rgba(34,197,94,0.2)",
                      opacity: actionLoading[blog._id] ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!actionLoading[blog._id]) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(34,197,94,0.22)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(34,197,94,0.12)";
                    }}
                  >
                    {actionLoading[blog._id] === "approve" ? (
                      <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                    Approve
                  </button>

                  <button
                    onClick={() => rejectBlog(blog._id)}
                    disabled={!!actionLoading[blog._id]}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                    style={{
                      background: "rgba(239,68,68,0.10)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.2)",
                      opacity: actionLoading[blog._id] ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!actionLoading[blog._id]) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.20)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.10)";
                    }}
                  >
                    {actionLoading[blog._id] === "reject" ? (
                      <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    )}
                    Reject
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
