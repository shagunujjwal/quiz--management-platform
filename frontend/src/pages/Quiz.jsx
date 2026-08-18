import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);

  // =====================================================
  // LOAD QUIZ
  // =====================================================

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${id}`
        );

        console.log("QUIZ LOADED:", response.data);

        setQuiz(response.data);
      } catch (error) {
        console.error("LOAD QUIZ ERROR:", error);

        alert(
          error.response?.data?.message ||
            "Unable to load quiz."
        );

        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id, navigate]);

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  const selectAnswer = (optionIndex) => {
    const question = quiz.questions[currentQuestion];

    const optionText = question.options[optionIndex];

    const optionObject = question.optionObjects?.find(
      (option) => option.optionText === optionText
    );

    if (!optionObject) {
      console.error(
        "OPTION ID NOT FOUND:",
        question
      );

      alert("Option information not found.");
      return;
    }

    setSelectedAnswers((previous) => ({
      ...previous,

      [question.id]: {
        questionId: question.id,
        optionIndex: optionIndex,
        optionText: optionText,
        selectedOptionId: optionObject.id,
      },
    }));

    console.log("ANSWER SELECTED:", {
      questionId: question.id,
      optionText: optionText,
      selectedOptionId: optionObject.id,
    });
  };

  // =====================================================
  // NEXT QUESTION
  // =====================================================

  const handleNext = () => {
    const question = quiz.questions[currentQuestion];

    if (!selectedAnswers[question.id]) {
      alert("Please select an answer first.");
      return;
    }

    if (currentQuestion === quiz.questions.length - 1) {
      submitQuiz();
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
  };

  // =====================================================
  // SUBMIT QUIZ
  // =====================================================

  const submitQuiz = async () => {
    try {
      setSubmitting(true);

      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (!storedUser || !storedUser.id) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      // =================================================
      // CREATE ANSWERS FOR EVERY QUESTION
      // =================================================

      const answers = quiz.questions.map((question) => {
        const selected = selectedAnswers[question.id];

        return {
          questionId: Number(question.id),

          selectedOptionId: selected
            ? Number(selected.selectedOptionId)
            : null,
        };
      });

      console.log("ANSWERS:", answers);

      // Make sure every selected answer has an ID
      const invalidAnswer = answers.find(
        (answer) =>
          answer.selectedOptionId !== null &&
          Number.isNaN(answer.selectedOptionId)
      );

      if (invalidAnswer) {
        console.error(
          "INVALID ANSWER:",
          invalidAnswer
        );

        alert(
          "Answer data is incorrect. Please try again."
        );

        return;
      }

      // =================================================
      // SUBMIT TO BACKEND
      // =================================================

      const response = await axios.post(
        "http://localhost:5000/api/attempts",
        {
          quizId: Number(id),

          userId: Number(storedUser.id),

          answers: answers,

          timeTaken: 0,
        }
      );

      console.log(
        "QUIZ SUBMITTED:",
        response.data
      );

      // =================================================
      // GET RESULT FROM BACKEND
      // =================================================

      const attempt = response.data.attempt;

      setResult({
        score: attempt.score,

        total: attempt.totalMarks,

        percentage: attempt.percentage,

        correctAnswers:
          attempt.correctAnswers,

        incorrectAnswers:
          attempt.incorrectAnswers,

        unanswered:
          attempt.unanswered,

        status: attempt.status,
      });

      setFinished(true);
    } catch (error) {
      console.error(
        "SUBMIT QUIZ ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Unable to submit quiz."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading Quiz...</h2>
      </div>
    );
  }

  // =====================================================
  // QUIZ NOT FOUND
  // =====================================================

  if (!quiz) {
    return (
      <div style={styles.center}>
        <h2>Quiz not found</h2>

        <button
          style={styles.backButton}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // =====================================================
  // RESULT SCREEN
  // =====================================================

  if (finished) {
    return (
      <div style={styles.page}>
        <div style={styles.resultCard}>

          <div style={styles.trophy}>
            🏆
          </div>

          <h1>Quiz Completed!</h1>

          <h2>{quiz.title}</h2>

          <p style={styles.scoreText}>
            Your Score
          </p>

          <div style={styles.score}>
            {result?.score} / {result?.total}
          </div>

          <p style={styles.percentage}>
            {Number(result?.percentage || 0).toFixed(1)}%
          </p>

          <p style={styles.resultMessage}>
            {result?.status === "PASSED"
              ? "Congratulations! You Passed 🎉"
              : "Keep Practicing! 💪"}
          </p>

          <div style={styles.stats}>
            <p>
              ✅ Correct:{" "}
              {result?.correctAnswers || 0}
            </p>

            <p>
              ❌ Incorrect:{" "}
              {result?.incorrectAnswers || 0}
            </p>

            <p>
              ⭕ Unanswered:{" "}
              {result?.unanswered || 0}
            </p>
          </div>

          <button
            style={styles.button}
            onClick={() => navigate("/results")}
          >
            View My Results 📊
          </button>

          <button
            style={styles.backButton}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // CURRENT QUESTION
  // =====================================================

  const question = quiz.questions[currentQuestion];

  const selected = selectedAnswers[question.id];

  // =====================================================
  // QUIZ SCREEN
  // =====================================================

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}

        <div style={styles.top}>
          <h1 style={styles.title}>
            {quiz.title}
          </h1>

          <span style={styles.counter}>
            Question {currentQuestion + 1} /{" "}
            {quiz.questions.length}
          </span>
        </div>

        {/* PROGRESS */}

        <div style={styles.progressContainer}>
          <div
            style={{
              ...styles.progress,
              width: `${
                ((currentQuestion + 1) /
                  quiz.questions.length) *
                100
              }%`,
            }}
          />
        </div>

        {/* QUESTION */}

        <h2 style={styles.question}>
          {question.question}
        </h2>

        {/* OPTIONS */}

        <div>
          {question.options.map(
            (option, index) => {

              const isSelected =
                selected?.optionIndex === index;

              return (
                <button
                  key={index}
                  onClick={() =>
                    selectAnswer(index)
                  }
                  style={{
                    ...styles.option,

                    background: isSelected
                      ? "#1976d2"
                      : "#f8fafc",

                    color: isSelected
                      ? "white"
                      : "#333",

                    border: isSelected
                      ? "2px solid #1976d2"
                      : "2px solid #e2e8f0",
                  }}
                >
                  {String.fromCharCode(
                    65 + index
                  )}
                  . {option}
                </button>
              );
            }
          )}
        </div>

        {/* NEXT */}

        <button
          style={styles.nextButton}
          onClick={handleNext}
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : currentQuestion ===
              quiz.questions.length - 1
            ? "Submit Quiz"
            : "Next Question →"}
        </button>

        {/* EXIT */}

        <button
          style={styles.backButton}
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Exit Quiz
        </button>

      </div>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },

  card: {
    width: "100%",
    maxWidth: "700px",
    background: "white",
    padding: "35px",
    borderRadius: "16px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.1)",
  },

  resultCard: {
    width: "100%",
    maxWidth: "500px",
    background: "white",
    padding: "45px",
    borderRadius: "16px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  title: {
    color: "#1976d2",
    marginBottom: "5px",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  counter: {
    color: "#64748b",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  question: {
    marginTop: "30px",
    marginBottom: "25px",
    color: "#1e293b",
  },

  progressContainer: {
    width: "100%",
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    background: "#1976d2",
    transition: "width 0.3s",
  },

  option: {
    width: "100%",
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "10px",
    fontSize: "16px",
    textAlign: "left",
    cursor: "pointer",
  },

  nextButton: {
    width: "100%",
    padding: "14px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "15px",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },

  backButton: {
    width: "100%",
    padding: "12px",
    background: "#e5e7eb",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "12px",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  trophy: {
    fontSize: "60px",
  },

  scoreText: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "5px",
  },

  score: {
    fontSize: "45px",
    fontWeight: "bold",
    color: "#1976d2",
  },

  percentage: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#16a34a",
  },

  resultMessage: {
    fontSize: "18px",
    marginTop: "15px",
  },

  stats: {
    marginTop: "20px",
    textAlign: "left",
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "10px",
  },
};

export default Quiz;