"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import Link from "next/link";

export default function BookmarksPage() {

  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {

    const fetchBookmarks = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await api.get(
          "/blog/bookmarks",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setBookmarks(res.data);

      } catch (error) {
        console.log(error);
      }

    };

    fetchBookmarks();

  }, []);

  return (

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        My Bookmarks 🔖
      </h1>

      {
        bookmarks.length === 0 ? (

          <p>No bookmarks found.</p>

        ) : (

          bookmarks.map((bookmark) => (

            <div
              key={bookmark._id}
              className="border rounded-lg p-4 mb-4"
            >

              <h2 className="text-xl font-semibold">
                {bookmark.blog?.title}
              </h2>

              <p className="text-gray-600">
                {bookmark.blog?.category}
              </p>

              <br />

              <Link
                href={`/blogs/${bookmark.blog?._id}`}
                className="text-blue-600"
              >
                Read Blog →
              </Link>

            </div>

          ))

        )
      }

    </div>

  );
}