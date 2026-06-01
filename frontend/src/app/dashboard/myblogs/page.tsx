"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
  approved: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  pending: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

export default function MyBlogs() {

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useRequireAuth();
   
  //submitforReview
  const submitForReview = async (id:string) => {
    try {
      await api.put(`/blog/submit/${id}`, {});
      alert("Blog submitted for review");
      fetchBlogs();
    } catch(error:any) {
      console.log(error.response?.data);
    }
  };

//delete blog
const deleteBlog = async (id:string) => {

  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this blog?"
    );

  if(!confirmDelete){
    return;
  }

  try{
    await api.delete(`/blog/delete/${id}`);

    alert("Blog Deleted");

    setBlogs(
      blogs.filter(
        (blog)=>blog._id !== id
      )
    );

  }
  catch(error:any){

    console.log(
      error.response?.data
    );

  }

};

  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blog/myblogs");
      setBlogs(res.data);
    } catch (error: any) {
      console.log("Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchBlogs();
    }
  }, [authLoading, isAuthenticated]);

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
            My Content
          </p>
          <div className="flex items-end justify-between">
            <h1
              className="text-3xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              My Blogs
            </h1>
            {!loading && (
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {blogs.length} post{blogs.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Blog list */}
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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--bg-elevated)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text-muted)" }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>No posts yet</p>
            <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>Start writing your first blog post</p>
            <a
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "var(--accent)", color: "#0d0f14" }}
            >
              Create Post
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {blogs.map((blog, i) => {
              const status = statusConfig[blog.status?.toLowerCase()] || statusConfig.pending;
              return (
                <div
                  key={blog._id}
                  className={`rounded-2xl border p-6 transition-all duration-200 animate-fade-up`}
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--bg-border)",
                    animationDelay: `${(i + 2) * 0.05}s`,
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--bg-elevated)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--bg-border)";
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2
                        className="font-semibold text-base mb-1.5 truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {blog.title}
                      </h2>
                      <p
                        className="text-sm line-clamp-2 mb-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {blog.content}
                      </p>
                      {blog.category && (
                        <span
                          className="inline-block text-xs px-2.5 py-1 rounded-lg font-medium"
                          style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
                        >
                          {blog.category}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-3">

                      <div className="flex flex-col items-end">
                        <span
                          className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {status.label}
                        </span>

                        <div className="mt-2 flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 14 }}>👍</span>
                            <span className="font-medium">{blog.likes ?? 0}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 14 }}>💬</span>
                            <span className="font-medium">{blog.commentsCount ?? 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/edit/${blog._id}`)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                          style={{
                            background: "rgba(59,130,246,0.12)",
                            color: "#3b82f6"
                          }}
                        >
                          Edit
                        </button>

                        {blog.status === "draft" && (
                          <button
                            onClick={() => submitForReview(blog._id)}
                            className="px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                            style={{
                              background: "var(--accent)",
                              color: "#0d0f14"
                            }}
                          >
                            Submit For Review
                          </button>
                        )}

                        <button
                          onClick={() => deleteBlog(blog._id)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                          style={{
                            background: "rgba(239,68,68,0.12)",
                            color: "#ef4444"
                          }}
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
