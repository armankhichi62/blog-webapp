"use client";

import { useState, useEffect } from "react";
import { useAuth, useRequireAuth } from "../../context/AuthContext";
import api from "../../services/api";

const dashboardItems = [
  {
    href: "/dashboard/create",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    label: "Create Blog",
    description: "Write and publish a new post",
    accent: "#2563eb",
    accentBg: "rgba(37,99,235,0.12)",
  },
  {
    href: "/dashboard/myblogs",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    label: "My Blogs",
    description: "Manage all your blog posts",
    accent: "#4f46e5",
    accentBg: "rgba(79,70,229,0.12)",
  },
  {
    href: "/dashboard/pending",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label: "Pending Blogs",
    description: "Review and moderate submissions",
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.12)",
  },
  {
    href: "/dashboard/stats",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    label: "Dashboard Stats",
    description: "Analytics and platform overview",
    accent: "#22c55e",
    accentBg: "rgba(34,197,94,0.12)",
  },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { isAuthenticated } = useRequireAuth();
  const role = user?.role?.toLowerCase() ?? null;

  const [authorStats, setAuthorStats] = useState<any | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchAuthorStats = async () => {
      if (role !== 'author') return;
      setLoadingStats(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await api.get('/blog/stats/author', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setAuthorStats(res.data?.data ?? res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAuthorStats();
  }, [role]);

  if (loading || !isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-base)" }}
      >
        Loading...
      </div>
    );
  }

  const filteredItems = dashboardItems.filter((item) => {
    if (role === "author") {
      return item.href !== "/dashboard/pending" && item.href !== "/dashboard/stats";
    }

    if (role === "admin") {
      return item.href !== "/dashboard/create" && item.href !== "/dashboard/myblogs";
    }

    return true;
  });

  return (
    <div
      className="page-shell min-h-screen px-4 py-12 sm:px-6 sm:py-16"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-up stagger-1">
          <p className="eyebrow mb-2">
            Workspace overview
          </p>
          <h1
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Welcome back
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage your blog, review submissions, and track your growth.
          </p>
        </div>

        {/* Cards grid */}
        {role === 'author' ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {loadingStats ? (
                <div className="col-span-4">Loading stats...</div>
              ) : (
                [
                  { label: 'Total Blogs', value: authorStats?.totalBlogs ?? 0 },
                  { label: 'Draft', value: authorStats?.draftBlogs ?? 0 },
                  { label: 'Pending', value: authorStats?.pendingBlogs ?? 0 },
                  { label: 'Approved', value: authorStats?.approvedBlogs ?? 0 },
                  { label: 'Rejected', value: authorStats?.rejectedBlogs ?? 0 },
                  { label: 'Likes Received', value: authorStats?.totalLikesReceived ?? 0 },
                  { label: 'Comments Received', value: authorStats?.totalCommentsReceived ?? 0 }
                ].map((card) => (
                  <div key={card.label} className="surface-card surface-card-hover flex min-h-32 flex-col items-start justify-between p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-base font-black text-blue-600 shadow-sm">
                      {card.label.charAt(0)}
                    </div>
                    <div>
                      <div className="mt-4 text-2xl font-bold text-slate-900">{card.value}</div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Blog Performance</h2>
            </div>

            <div className="space-y-3">
              {(authorStats?.blogPerformance || []).map((b:any) => (
                <div key={b._id || b.title} className="surface-card flex items-center justify-between p-4">
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{b.title}</div>
                    <div className="mt-1 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold capitalize text-green-700">{b.status}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      <span className="font-medium">{b.likes ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
                      <span className="font-medium">{b.commentsCount ?? 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={`surface-card surface-card-hover group flex items-start gap-4 p-6 animate-fade-up stagger-${i + 2}`}
                style={{
                  textDecoration: "none",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ background: item.accentBg, color: item.accent }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2
                    className="font-semibold text-base mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.label}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {item.description}
                  </p>
                </div>
                <svg
                  className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "var(--text-muted)" }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
