"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import AuthVisual from "../../../components/AuthVisual";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await api.post("/auth/admin/login", {
        email,
        password,
      });

      await login(res.data.token, res.data.user);
      router.push("/dashboard/pending");
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
          eyebrow="Platform moderation"
          title="Keep every published story worth reading."
          description="Review submissions, monitor publishing activity, and maintain a high-quality reading experience for the Inkwell community."
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
              Admin Login
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Sign in with your admin credentials to review submissions.
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
                placeholder="admin@example.com"
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
            Admin accounts are managed by the platform team.
          </p>
        </div>
      </div>
    </div>
  );
}
