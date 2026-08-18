import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Results() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (!storedUser || !storedUser.id) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/attempts/user/${storedUser.id}`
      );

      console.log("MY RESULTS:", response.data);

      setResults(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "LOAD RESULTS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load results."
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
      <div style={styles.center}>
        <h2>Loading Results...</h2>
      </div>
    );
  }

  // ==========================================
  // NO RESULTS
  // ==========================================

  if (results.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyCard}>
          <div style={styles.icon}>📊</div>

          <h1>No Results Yet</h1>

          <p>
            You have not completed any quiz yet.
          </p>

          <button
            style={styles.button}
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Take a Quiz
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RESULTS PAGE
  // ==========================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>
              My Results
            </h1>

            <p style={styles.subheading}>
              View your completed quiz results.
            </p>
          </div>

          <button
            style={styles.backButton}
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>
        </div>

        {/* RESULT CARDS */}

        <div style={styles.grid}>

          {results.map((result) => {

            // --------------------------------
            // QUIZ TITLE
            // --------------------------------

            const quizTitle =
              result.quiz?.title ||
              result.quizTitle ||
              result.title ||
              "Quiz";

            // --------------------------------
            // SCORE
            // --------------------------------

            const score =
              Number(result.score) || 0;

            // --------------------------------
            // TOTAL
            // --------------------------------

            let total = 0;

            if (result.totalMarks) {
              total = Number(
                result.totalMarks
              );
            } else if (
              result.totalQuestions
            ) {
              total = Number(
                result.totalQuestions
              );
            } else if (
              result.quiz?.questions?.length
            ) {
              total =
                result.quiz.questions.length;
            } else {
              total =
                Number(
                  result.correctAnswers || 0
                ) +
                Number(
                  result.incorrectAnswers || 0
                ) +
                Number(
                  result.unanswered || 0
                );
            }

            // --------------------------------
            // PERCENTAGE
            // --------------------------------

            let percentage =
              Number(result.percentage);

            if (
              Number.isNaN(percentage) ||
              percentage === 0
            ) {
              percentage =
                total > 0
                  ? (score / total) * 100
                  : 0;
            }

            // --------------------------------
            // STATUS
            // --------------------------------

            const passed =
              result.status === "PASSED";

            // --------------------------------
            // CORRECT
            // --------------------------------

            const correct =
              Number(
                result.correctAnswers
              ) || 0;

            // --------------------------------
            // INCORRECT
            // --------------------------------

            const incorrect =
              Number(
                result.incorrectAnswers
              ) || 0;

            // --------------------------------
            // UNANSWERED
            // --------------------------------

            const unanswered =
              Number(
                result.unanswered
              ) || 0;

            return (
              <div
                key={result.id}
                style={styles.card}
              >

                {/* QUIZ TITLE */}

                <h2 style={styles.title}>
                  {quizTitle}
                </h2>

                {/* DATE */}

                <p style={styles.date}>
                  {result.completedAt
                    ? new Date(
                        result.completedAt
                      ).toLocaleString()
                    : "Recently completed"}
                </p>

                {/* SCORE */}

                <div style={styles.scoreBox}>

                  <div style={styles.score}>
                    {score}

                    <span style={styles.total}>
                      {" "}
                      / {total}
                    </span>
                  </div>

                  <div style={styles.percentage}>
                    {percentage.toFixed(1)}%
                  </div>

                </div>

                {/* STATUS */}

                <div
                  style={{
                    ...styles.status,
                    background: passed
                      ? "#dcfce7"
                      : "#fee2e2",
                    color: passed
                      ? "#15803d"
                      : "#dc2626",
                  }}
                >
                  {passed
                    ? "PASSED ✓"
                    : "FAILED ✕"}
                </div>

                {/* STATS */}

                <div style={styles.stats}>

                  <div
                    style={styles.statsItem}
                  >
                    <span>
                      ✅ Correct
                    </span>

                    <strong>
                      {correct}
                    </strong>
                  </div>

                  <div
                    style={styles.statsItem}
                  >
                    <span>
                      ❌ Incorrect
                    </span>

                    <strong>
                      {incorrect}
                    </strong>
                  </div>

                  <div
                    style={styles.statsItem}
                  >
                    <span>
                      ⭕ Unanswered
                    </span>

                    <strong>
                      {unanswered}
                    </strong>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* TAKE ANOTHER QUIZ */}

        <button
          style={styles.quizButton}
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Take Another Quiz
        </button>

      </div>
    </div>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  heading: {
    margin: 0,
    color: "#1e293b",
    fontSize: "32px",
  },

  subheading: {
    color: "#64748b",
    marginTop: "8px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  title: {
    margin: 0,
    color: "#1976d2",
    fontSize: "22px",
  },

  date: {
    color: "#64748b",
    fontSize: "13px",
    marginTop: "8px",
  },

  scoreBox: {
    textAlign: "center",
    marginTop: "25px",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
  },

  score: {
    fontSize: "42px",
    fontWeight: "bold",
    color: "#1976d2",
  },

  total: {
    fontSize: "24px",
    color: "#64748b",
  },

  percentage: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#16a34a",
    marginTop: "5px",
  },

  status: {
    textAlign: "center",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
    marginTop: "15px",
  },

  stats: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  statsItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    background: "#f8fafc",
    borderRadius: "8px",
  },

  button: {
    marginTop: "20px",
    padding: "13px 25px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },

  quizButton: {
    display: "block",
    margin: "35px auto 0",
    padding: "14px 30px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },

  backButton: {
    padding: "12px 20px",
    background: "#e2e8f0",
    color: "#334155",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "white",
    padding: "50px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  icon: {
    fontSize: "60px",
    marginBottom: "15px",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Results;