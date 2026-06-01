"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function StatsPage() {

  const [stats, setStats] = useState<any>({});

  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

}, []);

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await api.get(
          "/blog/stats/dashboard",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

        setStats(res.data);

      } catch(error:any) {

        console.log(error.response?.data);

      }

    };

    fetchStats();

  }, []);

  return (
    <div>

      <h1>Dashboard Stats</h1>

      <p>Total Blogs: {stats.totalBlogs}</p>

      <p>Approved Blogs: {stats.approvedBlogs}</p>

      <p>Pending Blogs: {stats.pendingBlogs}</p>

      <p>Rejected Blogs: {stats.rejectedBlogs}</p>

    </div>
  );
}