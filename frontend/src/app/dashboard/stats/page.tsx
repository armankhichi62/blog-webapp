"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

const statCards = [
  {
    key: "totalBlogs",
    label: "Total Posts",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
  },
  {
    key: "approvedBlogs",
    label: "Approved",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
  },
  {
    key: "pendingBlogs",
    label: "Pending Review",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  {
    key: "rejectedBlogs",
    label: "Rejected",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
  {
    key: "totalLikes",
    label: "Total Likes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    color: "#e11d48",
    bg: "rgba(225,29,72,0.1)",
  },
  {
    key: "totalComments",
    label: "Total Comments",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
      </svg>
    ),
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
  },
];

export default function StatsPage() {

  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useRequireAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const fetchStats = async () => {
        try {
          const res = await api.get("/blog/stats/dashboard");
          setStats(res.data);
        } catch (error: any) {
          console.log(error.response?.data);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [authLoading, isAuthenticated]);

  const approvedPct = stats.totalBlogs
    ? Math.round((stats.approvedBlogs / stats.totalBlogs) * 100)
    : 0;

  const getStatValue = (key: string) => {
    if (key === "totalLikes") return stats.totalLikes ?? stats.totalLikesReceived ?? 0;
    if (key === "totalComments") return stats.totalComments ?? stats.totalCommentsReceived ?? 0;
    return stats[key] ?? 0;
  };

  return (
    <div
      className="page-shell min-h-screen px-4 py-12 sm:px-6 sm:py-16"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 animate-fade-up stagger-1">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm mb-5 transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Dashboard
          </a>
          <p className="eyebrow mb-2">
            Analytics
          </p>
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Dashboard Stats
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            An overview of your platform&apos;s blog activity.
          </p>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {statCards.map((card, i) => (
                <div
                  key={card.key}
                  className="surface-card surface-card-hover relative overflow-hidden p-6 animate-fade-up"
                  style={{
                    animationDelay: `${(i + 2) * 0.05}s`,
                    opacity: 0,
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ background: card.bg, color: card.color }}
                    >
                      {card.icon}
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                    {getStatValue(card.key)}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {card.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Approval rate bar */}
            {stats.totalBlogs > 0 && (
              <div
                className="rounded-2xl border p-6 animate-fade-up stagger-5"
                style={{ background: "var(--bg-surface)", borderColor: "var(--bg-border)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Approval Rate
                  </p>
                  <p className="text-sm font-bold" style={{ color: "#22c55e" }}>
                    {approvedPct}%
                  </p>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${approvedPct}%`, background: "#22c55e" }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>0%</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>100%</span>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
