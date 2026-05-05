import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const inputCls = "w-full rounded-md px-3 py-2.5 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-amber-400/50 transition-all placeholder:text-slate-600";
const inputStyle = { background: "#0d1220", border: "1px solid rgba(255,255,255,0.08)" };

const ProjectsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", members: [] });

  const fetchProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
    if (isAdmin) {
      api.get("/users").then((res) => setUsers(res.data));
    }
  }, [isAdmin]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", formData);
      setFormData({ title: "", description: "", members: [] });
      toast.success("Project created");
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div>
        <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>Workspace</p>
        <h1 className="text-2xl font-semibold text-white" style={{ letterSpacing: "-0.02em" }}>Projects</h1>
      </div>

      {isAdmin && (
        <div className="rounded-lg p-5" style={{ background: "#131929", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>New Project</p>
          <form className="space-y-3" onSubmit={handleCreate}>
            <input
              className={inputCls}
              style={inputStyle}
              placeholder="Project title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              className={inputCls}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="Description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div>
              <p className="text-xs mb-1.5" style={{ color: "#64748b" }}>
                Members <span style={{ color: "#334155" }}>(hold Ctrl/Cmd to multi-select)</span>
              </p>
              <select
                className={inputCls}
                style={inputStyle}
                multiple
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    members: Array.from(e.target.selectedOptions, (o) => o.value),
                  })
                }
              >
                {users.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-md px-5 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
              style={{ background: "#fbbf24" }}
            >
              Create Project
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project._id}
            className="rounded-lg p-4"
            style={{ background: "#131929", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-slate-100 text-sm">{project.title}</h3>
              <span
                className="text-xs rounded px-2 py-0.5 flex-shrink-0"
                style={{
                  color: "#64748b",
                  background: "rgba(100,116,139,0.1)",
                  border: "1px solid rgba(100,116,139,0.15)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {project.members?.length || 0} member{(project.members?.length || 0) !== 1 ? "s" : ""}
              </span>
            </div>
            {project.description && (
              <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{project.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;