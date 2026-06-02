"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.role?.toLowerCase();

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Explore" },
    { href: "/author/login", label: "Sign in" },
    { href: "/author/register", label: "Get started" },
    { href: "/admin/login", label: "Admin" },
  ];

  const authorLinks = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Explore" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/create", label: "Write" },
    { href: "/dashboard/myblogs", label: "My Blogs" },
     { href: "/dashboard/bookmarks", label: "Bookmarks" },
  ];

  const adminLinks = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Explore" },
    { href: "/dashboard/pending", label: "Reviews" },
    { href: "/dashboard/stats", label: "Analytics" },
    { href: "/dashboard", label: "Dashboard" },
    {href: "/admin/comments", label: "Comments"},
  ];

  const navLinks = isAuthenticated
    ? role === "admin"
      ? adminLinks
      : authorLinks
    : publicLinks;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="group flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-md shadow-blue-200 transition-transform group-hover:scale-105">
            Iw
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
              Inkwell
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">
              Stories that matter
            </span>
          </div>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          {isAuthenticated && (
            <button onClick={logout} className="ml-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600">
              Logout
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 shadow-lg md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  isActive(link.href) ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </a>
            ))}
            {isAuthenticated && (
              <button onClick={logout} className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
