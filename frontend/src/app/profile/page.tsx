"use client";

import { useEffect } from "react";
import { useAuth, useRequireAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const { isAuthenticated } = useRequireAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // `useRequireAuth` already redirects.
    }
  }, [loading, isAuthenticated]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg-base)" }}>
        <div className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 animate-fade-up stagger-1">
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
            Profile
          </p>
          <h1 className="text-4xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Your account
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage your name, email, and account settings.
          </p>
        </div>

        <div className="rounded-2xl border p-8" style={{ background: "var(--bg-surface)", borderColor: "var(--bg-border)" }}>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                Name
              </p>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                Email
              </p>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                Role
              </p>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                {user.role}
              </p>
            </div>

            <button
              onClick={logout}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
              style={{ background: "var(--accent)", color: "#0d0f14" }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
