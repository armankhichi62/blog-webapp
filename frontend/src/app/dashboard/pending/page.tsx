"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
 
export default function PendingBlogs() {
  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

}, []);

  const [blogs, setBlogs] = useState<any[]>([]);

  const fetchBlogs = async () => {

    const token = localStorage.getItem("token");

    const res = await api.get(
      "/blog/pending",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setBlogs(res.data);
  };

  const approveBlog = async(id:string)=>{

  try{

    const token = localStorage.getItem("token");

    await api.put(
      `/blog/approve/${id}`,
      {},
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    fetchBlogs();

  }catch(error:any){
    console.log(error.response?.data);
  }

};

const rejectBlog = async(id:string)=>{

  try{

    const token = localStorage.getItem("token");

    await api.put(
      `/blog/reject/${id}`,
      {},
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    fetchBlogs();

  }catch(error:any){
    console.log(error.response?.data);
  }

};


  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>

      <h1>Pending Blogs</h1>

      {
        blogs.map((blog) => (

          <div key={blog._id}>

            <h2>{blog.title}</h2>

            <p>{blog.content}</p>

            <button
            onClick={() => approveBlog(blog._id)}
              >
                Approve
              </button>

              <button
                onClick={() => rejectBlog(blog._id)}
              >
                Reject
              </button>

            <hr />

          </div>

        ))
      }

    </div>
  );
}



