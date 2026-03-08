import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const res = await authApi.register(form);
      localStorage.setItem("secureid_student_id", res.data.id);
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      const detail = err.response?.data?.detail;
      setError(
        Array.isArray(detail)
          ? detail.map((e) => e.msg || JSON.stringify(e)).join("; ")
          : detail || "Registration failed",
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-8">
      <h1 className="text-2xl font-bold mb-2 text-slate-900">
        Student Registration
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Create your SECUREID account.
      </p>
      {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
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
            minLength={8}
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
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="mt-6 text-sm text-center text-slate-500">
        Already registered?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Login instead
        </Link>
        .
      </p>
    </div>
  );
}
