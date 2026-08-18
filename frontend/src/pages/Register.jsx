import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://quiz-management-platform-hg8y.onrender.com/api/auth/register",
        form
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-blue-600">
          QuizMaster
        </h1>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Create Account
        </h2>

        <p className="mt-2 text-slate-500">
          Register as a student to start taking quizzes
        </p>

        {message && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create password"
              minLength="6"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="mt-6 text-center text-slate-600">
          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-blue-600"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;