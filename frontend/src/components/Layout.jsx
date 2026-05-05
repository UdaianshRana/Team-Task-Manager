import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useDarkMode from "../hooks/useDarkMode";

const navStyle = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-none border-l-2 transition-all duration-150 ${
    isActive
      ? "border-amber-400 bg-amber-400/10 text-amber-400"
      : "border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-200"
  }`;

const Layout = () => {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen md:flex" style={{ fontFamily: "'DM Sans', sans-serif", background: "#0b0f1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .sidebar-glow { box-shadow: inset -1px 0 0 rgba(255,255,255,0.06); }
        .nav-logo { letter-spacing: -0.03em; }
        .user-chip { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); }
        .btn-mode { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; transition: all 0.15s; }
        .btn-mode:hover { background: rgba(255,255,255,0.09); color: #e2e8f0; }
        .btn-logout { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); color: #f87171; transition: all 0.15s; }
        .btn-logout:hover { background: rgba(239,68,68,0.2); }
        .main-area { background: #0d1220; }
        .version-dot { width: 6px; height: 6px; background: #34d399; border-radius: 50%; display: inline-block; box-shadow: 0 0 6px #34d399; }
      `}</style>

      <aside className="sidebar-glow w-full md:w-60 flex-shrink-0 flex flex-col" style={{ background: "#0b0f1a", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Logo */}
        <div className="px-5 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Link to="/dashboard" className="nav-logo block text-base font-semibold text-white tracking-tight">
            Team<span className="text-amber-400">Task</span>
          </Link>
          <p className="mt-0.5 text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#475569" }}>MANAGER</p>
        </div>

        {/* User chip */}
        <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="user-chip flex items-center gap-2.5 rounded-md px-3 py-2.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-xs font-semibold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>{user?.role}</p>
            </div>
            <span className="version-dot ml-auto flex-shrink-0" title="Online" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5">
          <p className="px-5 mb-2 text-xs font-medium uppercase tracking-widest" style={{ color: "#334155", fontFamily: "'DM Mono', monospace" }}>Navigation</p>
          <NavLink to="/dashboard" className={navStyle}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </NavLink>
          <NavLink to="/projects" className={navStyle}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
            Projects
          </NavLink>
          <NavLink to="/tasks" className={navStyle}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Tasks
          </NavLink>
        </nav>

        {/* Bottom controls */}
        <div className="px-4 py-4 space-y-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button onClick={logout} className="btn-logout w-full rounded-md px-3 py-2 text-xs font-medium text-left flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-area flex-1 p-6 md:p-10 min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;