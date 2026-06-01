"use client";

import { useEffect } from "react";

export default function Dashboard() {

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }

  }, []);

  return (
  <div className="w-full border p-3 rounded">

    <h1 className="text-4xl font-bold mb-8">
      Dashboard
    </h1>

    <div className="grid grid-cols-2 gap-4">

      <a
        href="/dashboard/create"
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Create Blog
      </a>

      <a
        href="/dashboard/myblogs"
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        My Blogs
      </a>

      <a
        href="/dashboard/pending"
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Pending Blogs
      </a>

      <a
        href="/dashboard/stats"
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Dashboard Stats
      </a>

    </div>

  </div>
);
}