import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/users"
      );

      console.log("USERS:", response.data);

      setUsers(response.data);
    } catch (error) {
      console.error("LOAD USERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase().trim();

    return (
      user.name?.toLowerCase().includes(text) ||
      user.email?.toLowerCase().includes(text) ||
      user.role?.toLowerCase().includes(text)
    );
  });

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="bg-white shadow-sm">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>

            <h1 className="text-2xl font-bold text-blue-600">
              QuizMaster
            </h1>

            <p className="text-sm text-slate-500">
              User Management
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={() => navigate("/admin")}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Admin Dashboard
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

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="mb-6">

          <h2 className="text-3xl font-bold text-slate-900">
            User Management 👥
          </h2>

          <p className="mt-2 text-slate-600">
            View and manage registered users.
          </p>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">

            <div className="text-4xl">
              ⏳
            </div>

            <p className="mt-3 text-slate-500">
              Loading users...
            </p>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (

          <div className="rounded-xl bg-red-50 p-6 text-center">

            <p className="font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={loadUsers}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>

          </div>

        )}

        {/* =================================================
            USERS TABLE
        ================================================= */}

        {!loading && !error && (

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full">

                {/* TABLE HEADER */}

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody className="divide-y divide-slate-100">

                  {filteredUsers.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        No users found.
                      </td>

                    </tr>

                  ) : (

                    filteredUsers.map((user) => (

                      <tr
                        key={user.id}
                        className="hover:bg-slate-50"
                      >

                        {/* ID */}

                        <td className="px-6 py-4 text-slate-600">
                          {user.id}
                        </td>

                        {/* NAME */}

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {user.name}
                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-4 text-slate-600">
                          {user.email}
                        </td>

                        {/* ROLE */}

                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              user.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status || "ACTIVE"}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4">

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/users/${user.id}`
                              )
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            👁️ View Details
                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default UserManagement;