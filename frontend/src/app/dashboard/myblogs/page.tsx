"use client";

import { useEffect,useState } from "react";
import api from "../../../services/api";

export default function MyBlogs(){

    useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

}, []);

const [blogs,setBlogs] = useState<any[]>([]);

useEffect(() => {

  const fetchBlogs = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await api.get(
        "/blog/myblogs",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      console.log("Blogs:", res.data);

      setBlogs(res.data);

    } catch(error:any) {

      console.log("Error:", error.response?.data);

    }

  };

  fetchBlogs();

},[]);

}