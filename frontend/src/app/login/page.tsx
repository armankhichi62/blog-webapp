"use client";

import { useState } from "react";
import api from "../../services/api";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(245,166,35,0.04)" }}
      />

      <div
        className="relative w-full max-w-md animate-fade-up"
        style={{ animationDuration: "0.5s" }}
      >
        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--bg-border)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-5"
              style={{ background: "var(--accent)", color: "#0d0f14" }}
            >
              Iw
            </div>
            <h1
              className="text-2xl font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Sign in to your Inkwell account
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Email address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl text-sm border transition-all duration-200"
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: "var(--bg-border)",
                  color: "var(--text-primary)",
                }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl text-sm border transition-all duration-200"
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: "var(--bg-border)",
                  color: "var(--text-primary)",
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer mt-2 flex items-center justify-center gap-2"
              style={{
                background: loading ? "var(--accent-dim)" : "var(--accent)",
                color: "#0d0f14",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--accent-dim)";
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--accent)";
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
            Don&apos;t have an account?{" "}
            <a href="/register" style={{ color: "var(--accent)" }} className="hover:underline">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
