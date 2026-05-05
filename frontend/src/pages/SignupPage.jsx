import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const inputCls = "w-full rounded-md px-3 py-2.5 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-amber-400/50 transition-all placeholder:text-slate-600";
const inputStyle = { background: "#0d1220", border: "1px solid rgba(255,255,255,0.08)" };

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Member" });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
      toast.success("Signup successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
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
          <p className="text-xs font-medium uppercase tracking-widest mb-5" style={{ color: "#475569", fontFamily: "'DM Mono', monospace" }}>Create account</p>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              className={inputCls}
              style={inputStyle}
              placeholder="Full name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
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
              placeholder="Password (min 6 chars)"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <select
              className={inputCls}
              style={inputStyle}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              disabled={loading}
              className="w-full rounded-md py-2.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#fbbf24" }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <p className="mt-5 text-xs text-center" style={{ color: "#475569" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-medium" style={{ color: "#fbbf24" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;