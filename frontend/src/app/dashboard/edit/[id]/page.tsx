"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRequireAuth } from "../../../../context/AuthContext";
import api from "../../../../services/api";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const blogId = params?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useRequireAuth();

  useEffect(() => {
    if (!blogId) return;

    const loadBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(`/blog/${blogId}/edit`);
        const blog = res.data;
        setTitle(blog.title || "");
        setContent(blog.content || "");
        setCategory(blog.category || "");
      } catch (err: any) {
        setError(err.response?.data?.message || "Unable to load blog for editing.");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [blogId]);

  const updateBlog = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setError(null);
    setSaving(true);

    try {
      await api.put(`/blog/update/${blogId}`, {
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
      });
      router.push("/dashboard/myblogs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="page-shell min-h-screen px-4 py-12 sm:px-6 sm:py-16"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-2xl mx-auto">
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
            Update Post
          </p>
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Edit blog post
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Make updates to your article and save changes.
          </p>
        </div>

        <div
          className="surface-card p-6 animate-fade-up stagger-2 sm:p-8"
          style={{
            background: "var(--bg-surface)",
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Post Title
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200"
                  style={{ background: "var(--bg-elevated)", borderColor: "var(--bg-border)", color: "var(--text-primary)" }}
                  placeholder="Give your post a compelling title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Category
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200"
                  style={{ background: "var(--bg-elevated)", borderColor: "var(--bg-border)", color: "var(--text-primary)" }}
                  placeholder="e.g. Technology, Design, Lifestyle..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  Content
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 resize-none"
                  style={{ background: "var(--bg-elevated)", borderColor: "var(--bg-border)", color: "var(--text-primary)", minHeight: "240px" }}
                  placeholder="Update your story here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Changes will be saved and available in your posts.
                </p>
                <button
                  onClick={updateBlog}
                  disabled={saving || !title.trim() || !content.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: saving || !title.trim() || !content.trim() ? "var(--bg-elevated)" : "var(--primary)",
                    color: saving || !title.trim() || !content.trim() ? "var(--text-muted)" : "#ffffff",
                    cursor: saving || !title.trim() || !content.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
