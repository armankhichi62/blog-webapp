"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../services/api";

export default function BlogDetails() {

  const params = useParams();

  const [blog, setBlog] = useState<any>(null);

  const handleBookmark = async () => {

  try {

    const token = localStorage.getItem("token");

    await api.post(
      `/blog/bookmark/${blog._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Bookmarked Successfully");

  } catch (error: any) {

    alert(
      error.response?.data?.message
    );

  }

};


  useEffect(() => {

    const fetchBlog = async () => {

      try {

        const res = await api.get(
          `/blog/${params.id}`
        );

        setBlog(res.data);

      } catch (error) {
        console.log(error);
      }

    };

    fetchBlog();

  }, [params.id]);

  if (!blog) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
        {blog.image && (
  <img
    src={`http://localhost:5000${blog.image}`}
    alt={blog.title}
    className="w-full rounded-xl mb-8 shadow-lg"
  />
)}
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

      <div className="flex gap-4 text-gray-500 mb-6">
  <span>✍️ {blog.author?.name}</span>
  <span>📂 {blog.category}</span>
</div>

      <hr />

      <div className="prose prose-lg max-w-none">
  <p>{blog.content}</p>
</div>

      <br />

      <div className="mt-8 text-lg font-medium">
  ❤️ {blog.likes} Likes
</div>

<div className="mt-4">

  <button
    onClick={handleBookmark}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    🔖 Bookmark
  </button>

</div>

<h2 className="text-2xl font-semibold mt-12 mb-4">
  Comments
</h2>
    </div>
  );
}