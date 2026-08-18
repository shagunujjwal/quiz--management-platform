import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Performance() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD USER PERFORMANCE FROM DATABASE
  // ==========================================

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    try {
      setLoading(true);

      // Login ke time save hua user
      const savedUser = JSON.parse(
        localStorage.getItem("user")
      );

      console.log("LOGGED USER:", savedUser);

      if (!savedUser || !savedUser.id) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `https://quiz-management-platform-hg8y.onrender.com/api/attempts/user/${savedUser.id}`
      );

      console.log(
        "USER PERFORMANCE:",
        response.data
      );

      setResults(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "LOAD PERFORMANCE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load performance."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">

        <div className="text-center">

          <div className="text-5xl">
            ⏳
          </div>

          <p className="mt-3 text-lg font-semibold text-slate-600">
            Loading Performance...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalQuizzes = results.length;

  const bestScore =
    results.length > 0
      ? Math.max(
          ...results.map(
            (result) =>
              Number(result.percentage) || 0
          )
        )
      : 0;

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, result) =>
              sum +
              (Number(result.percentage) || 0),
            0
          ) / results.length
        )
      : 0;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="bg-white shadow-sm">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <h1 className="text-2xl font-bold text-blue-600">
            QuizMaster
          </h1>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Dashboard
          </button>

        </div>

      </nav>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="mx-auto max-w-6xl px-6 py-10">

        <h2 className="text-3xl font-bold text-slate-900">
          My Performance 🏆
        </h2>

        <p className="mt-2 text-slate-600">
          Track your quiz scores and progress.
        </p>

        {/* ====================================
            STATS
        ==================================== */}

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="text-3xl">
              📝
            </div>

            <h3 className="mt-4 text-lg font-bold">
              Total Quizzes
            </h3>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {totalQuizzes}
            </p>

          </div>

          {/* BEST */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="text-3xl">
              🏆
            </div>

            <h3 className="mt-4 text-lg font-bold">
              Best Score
            </h3>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {bestScore.toFixed(1)}%
            </p>

          </div>

          {/* AVERAGE */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="text-3xl">
              📊
            </div>

            <h3 className="mt-4 text-lg font-bold">
              Average Score
            </h3>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {averageScore}%
            </p>

          </div>

        </div>

        {/* ====================================
            QUIZ PERFORMANCE
        ==================================== */}

        <section className="mt-10">

          <h3 className="text-2xl font-bold text-slate-900">
            Quiz Performance
          </h3>

          {/* NO RESULTS */}

          {results.length === 0 ? (

            <div className="mt-5 rounded-xl bg-white p-8 text-center shadow-sm">

              <div className="text-5xl">
                📊
              </div>

              <h4 className="mt-4 text-xl font-bold">
                No Performance Data
              </h4>

              <p className="mt-2 text-slate-500">
                Complete a quiz to see your performance here.
              </p>

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Take a Quiz
              </button>

            </div>

          ) : (

            /* RESULTS */

            <div className="mt-5 space-y-5">

              {results.map((result) => {

                const percentage =
                  Number(
                    result.percentage
                  ) || 0;

                const passed =
                  result.status === "PASSED";

                return (

                  <div
                    key={result.id}
                    className="rounded-xl bg-white p-6 shadow-sm"
                  >

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                      {/* QUIZ INFO */}

                      <div>

                        <h4 className="text-xl font-bold text-slate-900">
                          {result.quiz?.title ||
                            "Quiz"}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">

                          {result.completedAt
                            ? new Date(
                                result.completedAt
                              ).toLocaleString()
                            : "-"}

                        </p>

                      </div>

                      {/* SCORE */}

                      <div className="text-left md:text-right">

                        <p className="text-2xl font-bold text-blue-600">

                          {result.score || 0}

                          {" / "}

                          {result.totalMarks ||
                            result.quiz?.questions ||
                            0}

                        </p>

                        <p className="text-sm font-semibold text-slate-500">

                          {percentage.toFixed(1)}%

                        </p>

                        {/* STATUS */}

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            passed
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >

                          {passed
                            ? "PASSED ✓"
                            : "FAILED ✕"}

                        </span>

                      </div>

                    </div>

                    {/* PROGRESS BAR */}

                    <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-slate-200">

                      <div
                        className={`h-full rounded-full ${
                          passed
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.max(
                              percentage,
                              0
                            ),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                    {/* DETAILS */}

                    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

                      <div className="rounded-lg bg-green-50 p-3 text-center">

                        <p className="text-sm text-slate-500">
                          Correct
                        </p>

                        <p className="text-lg font-bold text-green-600">
                          {result.correctAnswers ||
                            0}
                        </p>

                      </div>

                      <div className="rounded-lg bg-red-50 p-3 text-center">

                        <p className="text-sm text-slate-500">
                          Incorrect
                        </p>

                        <p className="text-lg font-bold text-red-600">
                          {result.incorrectAnswers ||
                            0}
                        </p>

                      </div>

                      <div className="rounded-lg bg-yellow-50 p-3 text-center">

                        <p className="text-sm text-slate-500">
                          Unanswered
                        </p>

                        <p className="text-lg font-bold text-yellow-600">
                          {result.unanswered ||
                            0}
                        </p>

                      </div>

                      <div className="rounded-lg bg-blue-50 p-3 text-center">

                        <p className="text-sm text-slate-500">
                          Time
                        </p>

                        <p className="text-lg font-bold text-blue-600">
                          {result.timeTaken ||
                            0}{" "}
                          sec
                        </p>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Performance;