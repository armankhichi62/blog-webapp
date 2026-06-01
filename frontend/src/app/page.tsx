"use client";

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {

  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {

    const fetchBlogs = async () => {

      try {

        const res = await api.get("/blog/published");

        setBlogs(res.data);

      } catch (error) {
        console.log(error);
      }

    };

    fetchBlogs();

  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h1>Published Blogs</h1>

      {blogs.map((blog) => (

        <div
          key={blog._id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px"
          }}
        >

          <h2>{blog.title}</h2>

          <p>{blog.content}</p>

          <p>
            <b>Status:</b> {blog.status}
          </p>

        </div>

      ))}

    </div>
  );
}