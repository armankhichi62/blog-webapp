"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
    ...(isAuthenticated
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/profile", label: "Profile" },
        ]
      : [
          { href: "/login", label: "Login" },
          { href: "/register", label: "Register" },
        ]),
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(13, 15, 20, 0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--bg-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-105"
            style={{ background: "var(--accent)", color: "#0d0f14" }}
          >
            Iw
          </div>
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Inkwell
          </span>
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: isActive(link.href) ? "var(--accent)" : "var(--text-secondary)",
                background: isActive(link.href) ? "var(--accent-glow)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.href)) {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.href)) {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }
              }}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Logout */}
        {isAuthenticated && (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 cursor-pointer"
            style={{
              color: "var(--text-secondary)",
              borderColor: "var(--bg-border)",
              background: "transparent",
            }}
          >
            Logout
          </button>
        )}

      </div>
    </nav>
  );
}
