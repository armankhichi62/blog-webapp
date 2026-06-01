"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

export default function CreateBlog() {

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useRequireAuth();

  const createBlog = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await api.post("/blog/create", { title: title.trim(), content: content.trim(), category: category.trim() });
      router.push("/dashboard/myblogs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "var(--bg-elevated)",
    borderColor: "var(--bg-border)",
    color: "var(--text-primary)",
  };

  return (
    <div
      className="page-shell min-h-screen px-4 py-12 sm:px-6 sm:py-16"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-2xl mx-auto">

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
          <p className="eyebrow mb-2">
            New Post
          </p>
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Create a blog post
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Share your ideas with the world. Your post will be reviewed before publishing.
          </p>
        </div>

        {/* Form card */}
        <div
          className="surface-card p-6 animate-fade-up stagger-2 sm:p-8"
          style={{
            background: "var(--bg-surface)",
          }}
        >
          <div className="space-y-6">

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Post Title
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200"
                style={inputStyle}
                placeholder="Give your post a compelling title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Category
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200"
                style={inputStyle}
                placeholder="e.g. Technology, Design, Lifestyle..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Content
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 resize-none"
                style={{ ...inputStyle, minHeight: "240px" }}
                placeholder="Write your story here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Your post will be submitted for review
              </p>
              <button
                onClick={createBlog}
                disabled={loading || !title || !content}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: (loading || !title || !content) ? "var(--bg-elevated)" : "var(--primary)",
                  color: (loading || !title || !content) ? "var(--text-muted)" : "#ffffff",
                  cursor: (loading || !title || !content) ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading && title && content)
                    (e.currentTarget as HTMLElement).style.background = "var(--primary-dark)";
                }}
                onMouseLeave={(e) => {
                  if (!loading && title && content)
                    (e.currentTarget as HTMLElement).style.background = "var(--primary)";
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Publish Post
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
