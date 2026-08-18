import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    // Validation
    if (!form.email.trim()) {
      setMessage("Please enter your email.");
      setMessageType("error");
      return;
    }

    if (!form.password) {
      setMessage("Please enter your password.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://quiz-management-platform-hg8y.onrender.com/api/auth/login",
        {
          email: form.email.trim(),
          password: form.password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token
        );
      }

      // ==========================================
      // SAVE USER
      // ==========================================

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      setMessage("Login successful! 🎉");
      setMessageType("success");

      // ==========================================
      // REDIRECT
      // ==========================================

      setTimeout(() => {
  if (response.data.user?.role === "ADMIN") {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }
}, 700);
        
      

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* LOGO */}

        <div className="text-center">

          <h1 className="text-3xl font-bold text-blue-600">
            QuizMaster
          </h1>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            Welcome Back
          </h2>

          <p className="mt-2 text-slate-500">
            Login to continue to your account
          </p>

        </div>

        {/* MESSAGE */}

        {message && (
          <div
            className={`mt-5 rounded-lg p-3 text-sm font-medium ${
              messageType === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="mb-2 block font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="mb-2 block font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* REGISTER */}

        <p className="mt-6 text-center text-slate-600">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;