import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(form);
      localStorage.setItem("secureid_token", res.data.access_token);
      // In a real app we'd fetch profile; here we just redirect to dashboard
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.detail && !Array.isArray(err.response.data.detail)
          ? err.response.data.detail
          : Array.isArray(err.response?.data?.detail)
            ? err.response.data.detail
                .map((e) => e.msg || JSON.stringify(e))
                .join("; ")
            : "Login failed",
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-8">
      <h1 className="text-2xl font-bold mb-2 text-slate-900">Student Login</h1>
      <p className="text-sm text-slate-500 mb-6">
        Access your SECUREID verification portal.
      </p>
      {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-sm shadow-primary/30"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-sm text-center text-slate-500">
        No account?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Register here
        </Link>
        .
      </p>
    </div>
  );
}
