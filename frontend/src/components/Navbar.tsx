"use client";

export default function Navbar() {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b shadow-sm">

      <h1 className="text-2xl font-bold">
        BlogApp
      </h1>

      <div className="flex gap-6">

        <a href="/">Home</a>

        <a href="/blogs">Blogs</a>

        <a href="/dashboard">Dashboard</a>

        <a href="/login">Login</a>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}