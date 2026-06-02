"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AdminComments() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/blog/comments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const deleteComment = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/blog/comment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments((prev) =>
        prev.filter((comment) => comment._id !== id)
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "#2563eb" }}
          >
            Admin Panel
          </p>

          <h1
            className="text-4xl font-bold mt-2"
            style={{ color: "var(--text-primary)" }}
          >
            Manage Comments
          </h1>

          <p
            className="mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Review and remove inappropriate comments.
          </p>
        </div>

        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <div className="surface-card p-8 text-center">
            No comments found.
          </div>
        ) : (
          <div className="space-y-4">

            {comments.map((comment) => (

              <div
                key={comment._id}
                className="surface-card p-5 flex flex-col gap-4"
              >
                <div>

                  <p
                    className="text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {comment.content}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

                    <span>
                      👤 {comment.user?.name || "Unknown User"}
                    </span>

                    <span>
                      📝 {comment.blog?.title || "Unknown Blog"}
                    </span>

                  </div>

                </div>

                <div>

                 <button
  onClick={() => deleteComment(comment._id)}
  style={{
    background: "#ef4444",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(239,68,68,0.25)"
  }}
>
  Delete Comment
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