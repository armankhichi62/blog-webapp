"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function BlogsPage() {

  const [blogs, setBlogs] = useState<any[]>([]);
  const [comment, setComment] = useState("");

  const fetchBlogs = async () => {

    try {

      const res = await api.get("/blog/published");

      setBlogs(res.data);

    } catch (error: any) {

      console.log(error.response?.data);

    }

  };

  const likeBlog = async (id: string) => {

    try {

      const token = localStorage.getItem("token");

      await api.put(
        `/blog/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchBlogs();

    } catch (error: any) {

      console.log(error.response?.data);

    }

  };

  const addComment = async (id: string) => {

    try {

      const token = localStorage.getItem("token");

      await api.post(
        `/blog/comment/${id}`,
        {
          content: comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Comment Added");

      setComment("");

    } catch (error: any) {

      console.log(error.response?.data);

    }

  };

  useEffect(() => {

    fetchBlogs();

  }, []);

  return (
  <div className="max-w-5xl mx-auto p-8">

    <h1 className="text-4xl font-bold mb-8 text-center">
      Published Blogs
    </h1>

    {blogs.map((blog) => (

      <div
        key={blog._id}
        className="border rounded-lg shadow-md p-6 mb-6"
      >

        <h2 className="text-2xl font-bold mb-3">
          {blog.title}
        </h2>

        <p className="mb-3">
          {blog.content}
        </p>

        <p className="mb-2">
          <strong>Category:</strong> {blog.category}
        </p>

        <p className="mb-4">
          <strong>Likes:</strong> {blog.likes}
        </p>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => likeBlog(blog._id)}
        >
          👍 Like
        </button>

        <br /><br />

        <input
          className="border p-2 rounded w-64"
          placeholder="Write Comment"
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded ml-2 hover:bg-blue-700"
          onClick={() =>
            addComment(blog._id)
          }
        >
          Add Comment
        </button>

      </div>

    ))}

  </div>
);
}