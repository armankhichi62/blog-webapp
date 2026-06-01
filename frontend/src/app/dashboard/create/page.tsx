"use client";

import { useState, useEffect } from "react";
import api from "../../../services/api";

export default function CreateBlog() {
  
  const [title,setTitle] = useState("");
  const [content,setContent] = useState("");
  const [category,setCategory] = useState("");

  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

}, []);

  const createBlog = async() => {

    const token = localStorage.getItem("token");

    await api.post(
      "/blog/create",
      {
        title,
        content,
        category
      },
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    alert("Blog Created");
  };

  return (

    <div>

      <h1>Create Blog</h1>

      <input
        placeholder="Title"
        onChange={(e)=>setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Content"
        onChange={(e)=>setContent(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Category"
        onChange={(e)=>setCategory(e.target.value)}
      />

      <br /><br />

      <button onClick={createBlog}>
        Create
      </button>

    </div>

  );
}