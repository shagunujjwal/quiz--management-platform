import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // ==========================================
  // ADMIN PROTECTION + FETCH QUIZZES
  // ==========================================

  useEffect(() => {
    // If ADMIN tries to open Student Dashboard,
    // redirect to Admin Dashboard
    if (user?.role === "ADMIN") {
      navigate("/admin", { replace: true });
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          "https://quiz-management-platform-hg8y.onrender.com/api/quizzes"
        );

        setQuizzes(response.data);
      } catch (err) {
        console.error("QUIZ ERROR:", err);
        setError("Unable to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [navigate, user?.role]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <h1 className="text-2xl font-bold text-blue-600">
            QuizMaster
          </h1>

          <div className="flex items-center gap-3">

            {/* Logout */}
            <button
              onClick={logout}
              className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* ==========================================
            WELCOME
        ========================================== */}

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.name || "Student"}! 👋
        </h2>

        <p className="mt-2 text-slate-600">
          Ready to test your knowledge?
        </p>

        {/* ==========================================
            DASHBOARD CARDS
        ========================================== */}

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* Available Quizzes */}

          <div
            onClick={() =>
              document
                .getElementById("available-quizzes")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="cursor-pointer rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="text-3xl">
              📝
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Available Quizzes
            </h3>

            <p className="mt-2 text-slate-500">
              {quizzes.length} quiz
              {quizzes.length !== 1 ? "zes" : ""} available
            </p>

            <p className="mt-3 font-semibold text-blue-600">
              View Quizzes →
            </p>

          </div>

          {/* My Results */}

          <div
            onClick={() => navigate("/results")}
            className="cursor-pointer rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="text-3xl">
              📊
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              My Results
            </h3>

            <p className="mt-2 text-slate-500">
              Check your previous quiz performance.
            </p>

            <p className="mt-3 font-semibold text-blue-600">
              View Results →
            </p>

          </div>

          {/* Performance */}

          <div
            onClick={() => navigate("/performance")}
            className="cursor-pointer rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="text-3xl">
              🏆
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Performance
            </h3>

            <p className="mt-2 text-slate-500">
              Track your scores and progress.
            </p>

            <p className="mt-3 font-semibold text-blue-600">
              View Performance →
            </p>

          </div>

        </div>

        {/* ==========================================
            AVAILABLE QUIZZES
        ========================================== */}

        <section
          id="available-quizzes"
          className="mt-10"
        >

          <h2 className="text-2xl font-bold text-slate-900">
            Available Quizzes
          </h2>

          {/* Loading */}

          {loading && (
            <p className="mt-5 text-slate-500">
              Loading quizzes...
            </p>
          )}

          {/* Error */}

          {error && (
            <p className="mt-5 text-red-500">
              {error}
            </p>
          )}

          {/* No Quizzes */}

          {!loading &&
            !error &&
            quizzes.length === 0 && (
              <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">

                <p className="text-slate-500">
                  No quizzes available yet.
                </p>

              </div>
            )}

          {/* Quiz Cards */}

          {!loading &&
            !error &&
            quizzes.length > 0 && (

              <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {quizzes.map((quiz) => (

                  <div
                    key={quiz.id}
                    className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >

                    {/* Category + Difficulty */}

                    <div className="flex items-start justify-between">

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">

                        {typeof quiz.category === "string"
                          ? quiz.category
                          : quiz.category?.name || "General"}

                      </span>

                      <span className="text-sm text-slate-500">

                        {quiz.difficulty || "Beginner"}

                      </span>

                    </div>

                    {/* Quiz Title */}

                    <h3 className="mt-5 text-xl font-bold text-slate-900">

                      {quiz.title}

                    </h3>

                    {/* Description */}

                    <p className="mt-2 text-sm text-slate-500">

                      {quiz.description}

                    </p>

                    {/* Quiz Information */}

                    <div className="mt-5 flex justify-between text-sm text-slate-500">

                      <span>
                        ⏱ {quiz.duration || 10} min
                      </span>

                      <span>
                        📝{" "}

                        {typeof quiz.questions === "number"
                          ? quiz.questions
                          : quiz.questions?.length || 0}{" "}

                        questions
                      </span>

                    </div>

                    {/* Start Quiz */}

                    <button
                      onClick={() =>
                        navigate(`/quiz/${quiz.id}`)
                      }
                      className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      Start Quiz
                    </button>

                  </div>

                ))}

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;