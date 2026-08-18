import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `https://quiz-management-platform-hg8y.onrender.com/api/users/${id}`
      );

      console.log("USER DETAILS:", response.data);

      setUser(response.data);
    } catch (error) {
      console.error("USER DETAILS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load user details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <div className="text-4xl">⏳</div>
          <p className="mt-3 text-slate-600">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <div className="text-4xl">❌</div>

          <p className="mt-3 font-semibold text-red-600">
            {error}
          </p>

          <button
            onClick={() => navigate("/admin/users")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}

      <nav className="bg-white shadow-sm">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              QuizMaster
            </h1>

            <p className="text-sm text-slate-500">
              User Details
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => navigate("/admin/users")}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Back to Users
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </div>

      </nav>

      {/* Main */}

      <main className="mx-auto max-w-4xl px-6 py-10">

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          <div className="mb-8 flex items-center gap-5">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
              👤
            </div>

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                {user?.name}
              </h2>

              <p className="mt-1 text-slate-500">
                User ID: {user?.id}
              </p>

            </div>

          </div>

          {/* User Information */}

          <div className="grid gap-5 md:grid-cols-2">

            <div className="rounded-xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Full Name
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {user?.name}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="mt-2 break-all text-lg font-semibold text-slate-900">
                {user?.email}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Role
              </p>

              <p className="mt-2">

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    user?.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user?.role}
                </span>

              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Account Status
              </p>

              <p className="mt-2">

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    user?.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user?.status || "ACTIVE"}
                </span>

              </p>

            </div>

          </div>

          {/* Actions */}

          <div className="mt-8 flex gap-3">

            <button
              onClick={() => navigate("/admin/users")}
              className="rounded-lg bg-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-300"
            >
              ← Back to User List
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default UserDetails;