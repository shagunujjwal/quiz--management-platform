import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminResults() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await axios.get(
        "https://quiz-management-platform-hg8y.onrender.com/api/attempts"
      );

      console.log("ALL ATTEMPTS:", response.data);

      setResults(response.data);
    } catch (error) {
      console.error("LOAD ADMIN RESULTS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load results."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading Results...</h2>
      </div>
    );
  }

  // ==============================
  // PAGE
  // ==============================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>
              All Quiz Results
            </h1>

            <p style={styles.subheading}>
              View all students' quiz attempts.
            </p>
          </div>

          <button
            style={styles.backButton}
            onClick={() =>
              navigate("/admin-dashboard")
            }
          >
            ← Admin Dashboard
          </button>
        </div>

        {/* EMPTY */}

        {results.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.icon}>📊</div>

            <h2>No Quiz Attempts Yet</h2>

            <p>
              No student has completed a quiz yet.
            </p>
          </div>
        ) : (
          <div style={styles.tableCard}>

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Student</th>
                    <th style={styles.th}>Quiz</th>
                    <th style={styles.th}>Score</th>
                    <th style={styles.th}>Percentage</th>
                    <th style={styles.th}>Correct</th>
                    <th style={styles.th}>Incorrect</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result, index) => {

                    const passed =
                      result.status === "PASSED";

                    return (
                      <tr key={result.id}>

                        <td style={styles.td}>
                          {index + 1}
                        </td>

                        <td style={styles.td}>
                          <strong>
                            {result.user?.name ||
                              "Unknown User"}
                          </strong>

                          <br />

                          <small style={styles.email}>
                            {result.user?.email ||
                              ""}
                          </small>
                        </td>

                        <td style={styles.td}>
                          {result.quiz?.title ||
                            "Quiz"}
                        </td>

                        <td style={styles.td}>
                          <strong>
                            {result.score || 0}
                          </strong>
                          {" / "}
                          {result.quiz?.questions || 0}
                        </td>

                        <td style={styles.td}>
                          {Number(
                            result.percentage || 0
                          ).toFixed(1)}
                          %
                        </td>

                        <td style={styles.td}>
                          <span style={styles.correct}>
                            {result.correctAnswers || 0}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <span style={styles.incorrect}>
                            {result.incorrectAnswers || 0}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <span
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
                          </span>
                        </td>

                        <td style={styles.td}>
                          {result.completedAt
                            ? new Date(
                                result.completedAt
                              ).toLocaleString()
                            : "-"}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>

          </div>
        )}

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
    maxWidth: "1200px",
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

  backButton: {
    padding: "12px 20px",
    background: "#e2e8f0",
    color: "#334155",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  tableCard: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "950px",
  },

  th: {
    background: "#f8fafc",
    color: "#475569",
    padding: "15px",
    textAlign: "left",
    borderBottom: "2px solid #e2e8f0",
    fontSize: "14px",
  },

  td: {
    padding: "15px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "14px",
  },

  email: {
    color: "#64748b",
  },

  correct: {
    color: "#15803d",
    fontWeight: "bold",
  },

  incorrect: {
    color: "#dc2626",
    fontWeight: "bold",
  },

  status: {
    display: "inline-block",
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },

  emptyCard: {
    background: "white",
    padding: "60px",
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

export default AdminResults;