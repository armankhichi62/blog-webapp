"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import AuthVisual from "../../../components/AuthVisual";

export default function AuthorLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await api.post("/auth/author/login", {
        email,
        password,
      });

      await login(res.data.token, res.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-shell min-h-screen px-4 py-10 sm:px-6"
    >
      <div
        className="mx-auto grid w-full max-w-5xl gap-6 animate-fade-up lg:grid-cols-[1.05fr_0.95fr]"
        style={{ animationDuration: "0.5s" }}
      >
        <AuthVisual
          eyebrow="Author workspace"
          title="Write with clarity. Publish with confidence."
          description="Manage drafts, submit stories for review, and keep an eye on reader engagement from one focused workspace."
        />
        <div
          className="auth-card rounded-3xl p-7 sm:p-9"
          style={{
            background: "var(--bg-surface)",
          }}
        >
          <div className="mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-5"
              style={{ background: "var(--primary)", color: "#ffffff" }}
            >
              Iw
            </div>
            <h1
              className="text-2xl font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              User Login
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Sign in to manage your drafts and publish new posts.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Email address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl text-sm border transition-all duration-200"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--bg-border)", color: "var(--text-primary)" }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl text-sm border transition-all duration-200"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--bg-border)", color: "var(--text-primary)" }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: loading ? "#93c5fd" : "var(--primary)",
                color: "#ffffff",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
            Need an account? <a href="/author/register" style={{ color: "var(--primary)" }} className="font-semibold hover:underline">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
