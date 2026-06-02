"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  "Technology",
  "Programming",
  "Web Development",
  "AI/ML",
  "Cyber Security",
  "Database",
  "Career"
];

const getAuthor = (blog: any) => blog.author?.name || blog.authorName || "Inkwell writer";
const getDate = (blog: any) => {
  const value = blog.publishedAt || blog.createdAt;
  return value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently published";
};

export default function BlogsPage() {
  const { user, isAuthenticated } = useAuth();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [blogComments, setBlogComments] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchComments = async(blogId:string)=>{

try{

const res = await api.get(
`/blog/comments/${blogId}`
);

setBlogComments((prev:any)=>({
...prev,
[blogId]:res.data
}));

}
catch(error:any){

console.log(error.response?.data);

}

};

  const fetchBlogs = async (search?: string, category?: string | null) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (search && search.trim()) {
        params.append("search", search.trim());
      }
      
      if (category) {
        params.append("category", category);
      }

      const queryString = params.toString();
      const url = queryString ? `/blog/published?${queryString}` : "/blog/published";
      
      const res = await api.get(url);
      setBlogs(res.data);
      res.data.forEach((blog: any) => {
        fetchComments(blog._id);
      });
    } catch (error: any) {
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    fetchBlogs(value, selectedCategory);
  };

  // Handle category filter click
  const handleCategoryClick = (category: string | null) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    fetchBlogs(searchQuery, newCategory);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    fetchBlogs("", null);
  };

  const hasLiked = (blog: any) => {
    if (blog.liked) return true;
    if (!user || !Array.isArray(blog.likedBy)) return false;
    return blog.likedBy.some(
      (id: any) => id?.toString() === user.id.toString()
    );
  };

  const likeBlog = async (id: string) => {
    if (!isAuthenticated) {
      alert("Please log in to like blogs.");
      return;
    }

    try {
      setLikingId(id);
      const response = await api.put(`/blog/like/${id}`);
      const { likes, liked } = response.data.data;

      setBlogs((prev) =>
        prev.map((blog) => {
          if (blog._id !== id) return blog;

          const likedBy = Array.isArray(blog.likedBy) ? [...blog.likedBy] : [];
          const userId = user?.id;

          const nextLikedBy = liked
            ? Array.from(new Set([...likedBy, userId]))
            : likedBy.filter((likedUserId: any) => likedUserId?.toString() !== userId);

          return {
            ...blog,
            likes,
            liked,
            likedBy: nextLikedBy,
          };
        })
      );
    } catch (error: any) {
      console.log(error.response?.data);
    } finally {
      setLikingId(null);
    }
  };

  const addComment = async (id: string) => {
    try {
      setCommentingId(id);
      await api.post(`/blog/comment/${id}`, { content: comments[id] });
      alert("Comment Added");
      fetchComments(id);
      setComments((prev) => ({ ...prev, [id]: "" }));
    } catch (error: any) {
      console.log(error.response?.data);
    } finally {
      setCommentingId(null);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div
      className="page-shell min-h-screen px-4 py-12 sm:px-6 sm:py-16"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center animate-fade-up stagger-1">
          <p className="eyebrow mb-2">
            Explore the library
          </p>
          <h1
            className="text-4xl font-semibold tracking-tight mb-3 sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Published Blogs
          </h1>
          <p className="text-sm leading-6 sm:text-base" style={{ color: "var(--text-secondary)" }}>
            Find useful stories, fresh ideas, and perspectives from our writing community.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-up stagger-2">
          <input
            type="text"
            placeholder="Search blogs by title..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border text-sm shadow-sm"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--bg-border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Category Filters */}
        <div className="mb-8 animate-fade-up stagger-3">
          <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            Filter by category
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick(null)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: selectedCategory === null ? "var(--primary)" : "var(--bg-surface)",
                color: selectedCategory === null ? "#ffffff" : "var(--text-secondary)",
                border: selectedCategory === null ? "1px solid var(--accent)" : `1px solid var(--bg-border)`,
                boxShadow: selectedCategory === null ? "0 6px 14px rgba(37,99,235,0.18)" : "none",
              }}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: selectedCategory === category ? "var(--primary)" : "var(--bg-surface)",
                  color: selectedCategory === category ? "#ffffff" : "var(--text-secondary)",
                  border: selectedCategory === category ? "1px solid var(--accent)" : `1px solid var(--bg-border)`,
                  boxShadow: selectedCategory === category ? "0 6px 14px rgba(37,99,235,0.18)" : "none",
                }}
              >
                {category}
              </button>
            ))}
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
            className="rounded-2xl border p-12 text-center animate-fade-up stagger-4"
            style={{ background: "var(--bg-surface)", borderColor: "var(--bg-border)" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--bg-elevated)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--text-muted)" }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>No blogs found</p>
            <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
              {searchQuery || selectedCategory ? "Try a different search or category." : "Check back soon for new articles"}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "var(--primary)", color: "#ffffff" }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {blogs.map((blog, i) => (
              <article key={blog._id} className="surface-card surface-card-hover overflow-hidden animate-fade-up" style={{ animationDelay: `${(i + 4) * 0.05}s`,  opacity: 0}}
              >
                {blog.image && (
                  <div className="
                surface-card
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-2xl
                ">
                <img
                  src={`http://localhost:5000${blog.image}`}
                  alt={blog.title}
                  className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

                {/* Article body */}
                <div className="p-7">

                  {/* Category + meta row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    {blog.category && (
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                      >
                        {blog.category}
                      </span>
                    )}
                    <span className="text-xs font-medium text-slate-400">{getDate(blog)}</span>
                  </div>

                  {/* Title */}
                  <a href={`/blogs/${blog._id}`}>
                  <h2
                    className="text-2xl font-semibold mb-3 leading-snug"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    {blog.title}
                  </h2>
                  </a>

                  {/* Content */}
                  <p
                    className="text-sm leading-7"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {blog.content}
                  </p>

                </div>

                {/* Divider */}
                <div className="border-t" style={{ borderColor: "var(--bg-border)" }} />

                {/* Actions row */}
                <div className="px-7 py-4 flex flex-wrap items-center justify-between gap-3" style={{ background: "var(--bg-elevated)" }}>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      {getAuthor(blog).charAt(0).toUpperCase()}
                    </span>
                    {getAuthor(blog)}
                  </div>

                  {/* Like button */}
                  <div className="flex items-center gap-2">
                  <button
                    onClick={() => likeBlog(blog._id)}
                    disabled={likingId === blog._id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer"
                    style={{
                      background: "#ffffff",
                      color: hasLiked(blog) ? "#ef4444" : "var(--text-secondary)",
                      borderColor: hasLiked(blog) ? "rgba(239,68,68,0.3)" : "var(--bg-border)",
                      opacity: likingId === blog._id ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#ef4444";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.3)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = hasLiked(blog) ? "#ef4444" : "var(--text-secondary)";
                      (e.currentTarget as HTMLElement).style.borderColor = hasLiked(blog) ? "rgba(239,68,68,0.3)" : "var(--bg-border)";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>{blog.likes ?? 0}</span>
                  </button>
                  <span className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
                    </svg>
                    {blogComments[blog._id]?.length ?? blog.commentsCount ?? 0}
                  </span>
                  </div>

                </div>

                      <div className="px-7 pb-4">
                        <button
                          onClick={() =>
                            setExpandedComments((prev) => ({
                              ...prev,
                              [blog._id]: !prev[blog._id],
                            }))
                          }
                          className="text-sm font-medium cursor-pointer"
                          style={{ color: "var(--primary)" }}
                        >
                          {expandedComments[blog._id]
                            ? "▲ Hide Comments"
                            : `💬 Comments (${blogComments[blog._id]?.length || 0})`}
                        </button>
                      </div>

                      {expandedComments[blog._id] && (
                        <>
                    {/* Comment Input */}
                    <div
                      className="mx-4 mt-5 rounded-xl p-4 sm:mx-7"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--bg-border)"
                      }}
                    >

                      <div className="flex items-center gap-2">

                        <input
                          className="flex-1 px-4 py-2.5 rounded-xl border text-sm"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: "var(--bg-border)",
                            color: "var(--text-primary)",
                          }}
                          placeholder="Write a comment..."
                          value={comments[blog._id] || ""}
                          onChange={(e) =>
                            setComments((prev) => ({
                              ...prev,
                              [blog._id]: e.target.value,
                            }))
                          }
                        />

                        <button
                          onClick={() => addComment(blog._id)}
                          disabled={
                            commentingId === blog._id ||
                            !comments[blog._id]?.trim()
                          }
                          className="px-4 py-2 rounded-xl font-medium"
                          style={{
                            background:
                              commentingId === blog._id
                                ? "var(--bg-border)"
                                : "var(--primary)",
                            color:
                              commentingId === blog._id
                                ? "var(--text-muted)"
                                : "#ffffff",
                          }}
                        >
                          {commentingId === blog._id
                            ? "Posting..."
                            : "Post"}
                              </button>

                            </div>

                          </div>

                                {/* Comments List */}
                              <div
                                className="mx-4 mb-6 mt-5 sm:mx-7"
                                style={{ borderColor: "var(--bg-border)" }}
                              >

                                                              <h3
                                className="font-semibold mb-3"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Comments ({blogComments[blog._id]?.length || 0})
                              </h3>
                                                                            
                                  {blogComments[blog._id]?.length > 0 ? (

                                blogComments[blog._id].map((comment:any) => (

                                  <div
                                    key={comment._id}
                                    className="rounded-xl border p-4 mb-3"
                                    style={{
                                      borderColor: "var(--bg-border)",
                                      background: "var(--bg-elevated)"
                                    }}
                                  >
                                    <p className="font-semibold">
                                      {comment.user?.name}
                                    </p>

                                    <p>
                                      {comment.content}
                                    </p>
                                  </div>

                                ))

                              ) : (

                          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                            <svg className="mx-auto mb-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
                            </svg>
                            <span className="font-semibold text-slate-600">No comments yet</span>
                            <br />
                            Be the first to share a thought.
                          </div>

                      )}

                </div>
                </>
              )}
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
