
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await api.get("api/tasks", { params: { limit: 100 } });
      setTasks(data.data || []);
    };
    fetchTasks();
  }, []); 

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const overdue = tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "Completed").length;
    const assignedToMe = tasks.filter((t) => t.assignedTo?._id === user?.id).length;
    return { total, completed, overdue, assignedToMe };
  }, [tasks, user?.id]);

  const cards = [
    { label: "Total Tasks", value: stats.total, color: "#e2e8f0", accent: "rgba(255,255,255,0.06)", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
    )},
    { label: "Completed", value: stats.completed, color: "#34d399", accent: "rgba(52,211,153,0.08)", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: "Overdue", value: stats.overdue, color: "#f87171", accent: "rgba(248,113,113,0.08)", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
    )},
    { label: "Assigned to You", value: stats.assignedToMe, color: "#fbbf24", accent: "rgba(251,191,36,0.08)", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
    )},
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>Overview</p>
          <h1 className="text-2xl font-semibold text-white" style={{ letterSpacing: "-0.02em" }}>Dashboard</h1>
        </div>
        <p className="text-xs" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, color, accent, icon }) => (
          <div key={label} className="rounded-lg p-5 relative overflow-hidden" style={{ background: "#131929", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="absolute inset-0 opacity-100" style={{ background: accent }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium" style={{ color: "#64748b" }}>{label}</p>
                <div style={{ color }}>{icon}</div>
              </div>
              <p className="text-3xl font-semibold" style={{ color, letterSpacing: "-0.03em", fontFamily: "'DM Mono', monospace" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;