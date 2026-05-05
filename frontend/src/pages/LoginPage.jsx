import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const inputCls = "w-full rounded-md px-3 py-2.5 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-amber-400/50 transition-all placeholder:text-slate-600";
const inputStyle = { background: "#0d1220", border: "1px solid rgba(255,255,255,0.08)" };

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0b0f1a", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-semibold text-white" style={{ letterSpacing: "-0.03em" }}>
            Team<span style={{ color: "#fbbf24" }}>Task</span>
          </p>
          <p className="text-xs mt-1" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>MANAGER</p>
        </div>

        <div className="rounded-xl p-6" style={{ background: "#131929", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-medium uppercase tracking-widest mb-5" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>Sign in</p>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              className={inputCls}
              style={inputStyle}
              type="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              className={inputCls}
              style={inputStyle}
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              disabled={loading}
              className="w-full rounded-md py-2.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#fbbf24" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p className="mt-5 text-xs text-center" style={{ color: "#475569" }}>
            No account?{" "}
            <Link to="/signup" className="font-medium" style={{ color: "#fbbf24" }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;