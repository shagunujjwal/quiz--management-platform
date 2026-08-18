import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // =====================================================
  // LOAD QUIZZES
  // =====================================================

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/quizzes"
      );

      console.log("ADMIN QUIZZES:", response.data);

      setQuizzes(response.data);
    } catch (error) {
      console.error("LOAD QUIZZES ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load quizzes."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE QUIZ
  // =====================================================

  const deleteQuiz = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(id);

      const response = await axios.delete(
        `http://localhost:5000/api/quizzes/${id}`
      );

      console.log("DELETE QUIZ:", response.data);

      setQuizzes((previous) =>
        previous.filter((quiz) => quiz.id !== id)
      );

      alert("Quiz deleted successfully.");
    } catch (error) {
      console.error("DELETE QUIZ ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete quiz."
      );
    } finally {
      setDeleting(null);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingIcon}>⏳</div>

          <h2>Loading Admin Dashboard...</h2>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <header style={styles.header}>

        <div>
          <h1 style={styles.logo}>
            Quiz Management
          </h1>

          <p style={styles.adminText}>
            Admin Dashboard
          </p>
        </div>

        <button
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main style={styles.container}>

        {/* =================================================
            WELCOME
        ================================================= */}

        <div style={styles.welcomeCard}>

          <div>
            <h1 style={styles.welcomeTitle}>
              Welcome, Admin 👋
            </h1>

            <p style={styles.welcomeText}>
              Manage quizzes, users, view results and
              control your quiz platform.
            </p>
          </div>

          <div style={styles.adminIcon}>
            👨‍💼
          </div>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div style={styles.statsGrid}>

          {/* TOTAL QUIZZES */}

          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              📝
            </div>

            <div>
              <p style={styles.statLabel}>
                Total Quizzes
              </p>

              <h2 style={styles.statNumber}>
                {quizzes.length}
              </h2>
            </div>

          </div>

          {/* PUBLISHED */}

          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              ✅
            </div>

            <div>
              <p style={styles.statLabel}>
                Published
              </p>

              <h2 style={styles.statNumber}>
                {
                  quizzes.filter(
                    (quiz) =>
                      quiz.status === "PUBLISHED"
                  ).length
                }
              </h2>
            </div>

          </div>

          {/* CATEGORIES */}

          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              📚
            </div>

            <div>
              <p style={styles.statLabel}>
                Categories
              </p>

              <h2 style={styles.statNumber}>
                {
                  new Set(
                    quizzes.map(
                      (quiz) => quiz.category
                    )
                  ).size
                }
              </h2>
            </div>

          </div>

        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div style={styles.actionSection}>

          <h2 style={styles.sectionTitle}>
            Quick Actions
          </h2>

          <div style={styles.actionGrid}>

            {/* ADD QUIZ */}

            <button
              style={{
                ...styles.actionButton,
                background: "#1976d2",
              }}
              onClick={() =>
                navigate("/admin/add-quiz")
              }
            >
              <span style={styles.actionIcon}>
                ➕
              </span>

              <span>
                Add New Quiz
              </span>
            </button>

            {/* RESULTS */}

            <button
              style={{
                ...styles.actionButton,
                background: "#16a34a",
              }}
              onClick={() =>
                navigate("/admin-results")
              }
            >
              <span style={styles.actionIcon}>
                📊
              </span>

              <span>
                View Quiz Results
              </span>
            </button>

            {/* USER MANAGEMENT */}

            <button
              style={{
                ...styles.actionButton,
                background: "#7c3aed",
              }}
              onClick={() =>
                navigate("/admin/users")
              }
            >
              <span style={styles.actionIcon}>
                👥
              </span>

              <span>
                User Management
              </span>
            </button>

          </div>

        </div>

        {/* =================================================
            QUIZZES
        ================================================= */}

        <div style={styles.quizSection}>

          <div style={styles.quizHeader}>

            <div>
              <h2 style={styles.sectionTitle}>
                Manage Quizzes
              </h2>

              <p style={styles.sectionSubtitle}>
                Add, edit or delete quizzes.
              </p>
            </div>

            <button
              style={styles.addButton}
              onClick={() =>
                navigate("/admin/add-quiz")
              }
            >
              + Add New Quiz
            </button>

          </div>

          {/* =================================================
              NO QUIZZES
          ================================================= */}

          {quizzes.length === 0 ? (

            <div style={styles.emptyCard}>

              <div style={styles.emptyIcon}>
                📝
              </div>

              <h2>
                No Quizzes Yet
              </h2>

              <p>
                Create your first quiz to get
                started.
              </p>

              <button
                style={styles.addButton}
                onClick={() =>
                  navigate("/admin/add-quiz")
                }
              >
                + Create Quiz
              </button>

            </div>

          ) : (

            /* =================================================
               QUIZ GRID
            ================================================= */

            <div style={styles.quizGrid}>

              {quizzes.map((quiz) => (

                <div
                  key={quiz.id}
                  style={styles.quizCard}
                >

                  {/* CARD TOP */}

                  <div style={styles.quizTop}>

                    <div style={styles.quizEmoji}>
                      📝
                    </div>

                    <span
                      style={{
                        ...styles.status,
                        background:
                          quiz.status ===
                          "PUBLISHED"
                            ? "#dcfce7"
                            : "#fef3c7",
                        color:
                          quiz.status ===
                          "PUBLISHED"
                            ? "#15803d"
                            : "#b45309",
                      }}
                    >
                      {quiz.status || "DRAFT"}
                    </span>

                  </div>

                  {/* TITLE */}

                  <h2 style={styles.quizTitle}>
                    {quiz.title}
                  </h2>

                  {/* DESCRIPTION */}

                  <p style={styles.description}>
                    {quiz.description ||
                      "No description available."}
                  </p>

                  {/* DETAILS */}

                  <div style={styles.details}>

                    <div style={styles.detailRow}>
                      <span>
                        📚 Category
                      </span>

                      <strong>
                        {quiz.category ||
                          "General"}
                      </strong>
                    </div>

                    <div style={styles.detailRow}>
                      <span>
                        ❓ Questions
                      </span>

                      <strong>
                        {quiz.questions || 0}
                      </strong>
                    </div>

                    <div style={styles.detailRow}>
                      <span>
                        🎯 Difficulty
                      </span>

                      <strong>
                        {quiz.difficulty ||
                          "Easy"}
                      </strong>
                    </div>

                    <div style={styles.detailRow}>
                      <span>
                        ⏱ Duration
                      </span>

                      <strong>
                        {quiz.duration || 0} min
                      </strong>
                    </div>

                  </div>

                  {/* ACTION BUTTONS */}

                  <div style={styles.cardActions}>

                    {/* EDIT */}

                    <button
                      style={styles.editButton}
                      onClick={() =>
                        navigate(
                          `/admin/edit-quiz/${quiz.id}`
                        )
                      }
                    >
                      ✏️ Edit
                    </button>

                    {/* DELETE */}

                    <button
                      style={styles.deleteButton}
                      disabled={
                        deleting === quiz.id
                      }
                      onClick={() =>
                        deleteQuiz(quiz.id)
                      }
                    >
                      {deleting === quiz.id
                        ? "Deleting..."
                        : "🗑️ Delete"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

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
  },

  // HEADER

  header: {
    background: "white",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
  },

  logo: {
    margin: 0,
    color: "#1976d2",
    fontSize: "26px",
  },

  adminText: {
    margin: "4px 0 0",
    color: "#64748b",
  },

  logoutButton: {
    padding: "11px 22px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  // CONTAINER

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "35px 25px",
  },

  // WELCOME

  welcomeCard: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
    marginBottom: "25px",
  },

  welcomeTitle: {
    margin: 0,
    color: "#1e293b",
  },

  welcomeText: {
    color: "#64748b",
    marginTop: "8px",
  },

  adminIcon: {
    fontSize: "55px",
  },

  // STATS

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "35px",
  },

  statCard: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.06)",
  },

  statIcon: {
    fontSize: "35px",
  },

  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  statNumber: {
    margin: "5px 0 0",
    fontSize: "30px",
    color: "#1976d2",
  },

  // ACTIONS

  actionSection: {
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "35px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    margin: 0,
    color: "#1e293b",
  },

  sectionSubtitle: {
    color: "#64748b",
    marginTop: "6px",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  actionButton: {
    border: "none",
    color: "white",
    padding: "18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  actionIcon: {
    fontSize: "22px",
  },

  // QUIZ SECTION

  quizSection: {
    marginTop: "10px",
  },

  quizHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  addButton: {
    padding: "13px 22px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  quizGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },

  // QUIZ CARD

  quizCard: {
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  quizTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  quizEmoji: {
    fontSize: "35px",
  },

  status: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  quizTitle: {
    marginTop: "18px",
    marginBottom: "8px",
    color: "#1976d2",
    fontSize: "21px",
  },

  description: {
    color: "#64748b",
    lineHeight: "1.5",
    minHeight: "45px",
  },

  // DETAILS

  details: {
    marginTop: "20px",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "10px",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "7px 0",
    color: "#64748b",
    fontSize: "14px",
  },

  // BUTTONS

  cardActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "20px",
  },

  editButton: {
    padding: "12px",
    background: "#e0f2fe",
    color: "#0369a1",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteButton: {
    padding: "12px",
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  // EMPTY

  emptyCard: {
    background: "white",
    padding: "50px",
    textAlign: "center",
    borderRadius: "16px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  emptyIcon: {
    fontSize: "60px",
    marginBottom: "15px",
  },

  // LOADING

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
  },

  loadingBox: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  loadingIcon: {
    fontSize: "50px",
  },
};

export default AdminDashboard;