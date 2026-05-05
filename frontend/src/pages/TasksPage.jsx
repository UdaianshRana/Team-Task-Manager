import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const statuses = ["Todo", "In Progress", "Completed"];

const statusStyle = {
  "Todo": { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
  "In Progress": { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
  "Completed": { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
};

const inputCls = "w-full rounded-md px-3 py-2 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-amber-400/50 transition-all";
const inputStyle = { background: "#0d1220", border: "1px solid rgba(255,255,255,0.08)" };

const TasksPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ status: "", project: "", search: "", page: 1 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [formData, setFormData] = useState({ title: "", description: "", project: "", assignedTo: "", dueDate: "", status: "Todo" });

  const fetchTasks = async () => {
    const { data } = await api.get("api/tasks", { params: { ...filter, limit: 8 } });
    setTasks(data.data);
    setPagination(data.pagination);
  };

  useEffect(() => { fetchTasks(); }, [filter.page]);
  useEffect(() => {
    api.get("api/projects").then((res) => setProjects(res.data));
    if (isAdmin) api.get("api/users").then((res) => setUsers(res.data));
  }, [isAdmin]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("api/tasks", formData);
      toast.success("Task created");
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.put(`api/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div>
        <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>Workspace</p>
        <h1 className="text-2xl font-semibold text-white" style={{ letterSpacing: "-0.02em" }}>Tasks</h1>
      </div>

      {/* Create form — Admin only */}
      {isAdmin && (
        <div className="rounded-lg p-5" style={{ background: "#131929", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>New Task</p>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={handleCreate}>
            <input className={inputCls} style={inputStyle} placeholder="Task title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <input className={inputCls} style={inputStyle} type="date" required value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
            <textarea className={`${inputCls} md:col-span-2`} style={{ ...inputStyle, resize: "none", rows: 2 }} placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <select className={inputCls} style={inputStyle} required value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })}>
              <option value="">Select project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
            <select className={inputCls} style={inputStyle} required value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}>
              <option value="">Assign member</option>
              {users.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
            <button type="submit" className="md:col-span-2 rounded-md py-2.5 text-sm font-medium text-black transition-all hover:opacity-90" style={{ background: "#fbbf24" }}>
              Create Task
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg p-4" style={{ background: "#131929", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="grid gap-2 md:grid-cols-4">
          <input className={inputCls} style={inputStyle} placeholder="Search title…" onChange={(e) => setFilter({ ...filter, search: e.target.value, page: 1 })} />
          <select className={inputCls} style={inputStyle} onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}>
            <option value="">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className={inputCls} style={inputStyle} onChange={(e) => setFilter({ ...filter, project: e.target.value, page: 1 })}>
            <option value="">All projects</option>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
          <button className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition-all hover:opacity-80" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={fetchTasks}>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Task cards */}
      <div className="grid gap-3 md:grid-cols-2">
        {tasks.map((task) => {
          const st = statusStyle[task.status] || statusStyle["Todo"];
          const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "Completed";
          return (
            <div key={task._id} className="rounded-lg p-4 flex flex-col gap-3" style={{ background: "#131929", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-slate-100 text-sm leading-snug">{task.title}</h3>
                <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                  {task.status}
                </span>
              </div>
              {task.description && <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{task.description}</p>}
              <div className="flex items-center gap-2 flex-wrap">
                {task.project?.title && (
                  <span className="text-xs rounded px-2 py-0.5" style={{ color: "#94a3b8", background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.12)" }}>
                    {task.project.title}
                  </span>
                )}
                <span className="text-xs ml-auto" style={{ color: isOverdue ? "#f87171" : "#475569", fontFamily: "'DM Mono', monospace" }}>
                  Due {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {isOverdue && " · OVERDUE"}
                </span>
              </div>
              <select
                className="rounded-md px-3 py-2 text-xs font-medium outline-none cursor-pointer transition-all focus:ring-1 focus:ring-amber-400/40"
                style={{ background: "#0d1220", border: "1px solid rgba(255,255,255,0.08)", color: st.color }}
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <button
          className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-30 transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}
          disabled={pagination.page <= 1}
          onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
        >
          ← Prev
        </button>
        <p className="text-xs" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>
          {pagination.page} / {pagination.pages || 1}
        </p>
        <button
          className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-30 transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}
          disabled={pagination.page >= pagination.pages}
          onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default TasksPage;