const express = require("express");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");
const userRoutes = require("./routes/users");
const attemptsRoutes = require("./routes/attempts");
const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// MIDDLEWARE
// ==================================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://quiz-management-platform-gamma.vercel.app",
      "https://quiz-management-platform-3wuirlfan-shagunujjwal1.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "QuizMaster Backend is running 🚀",
  });
});

// =====================================================
// AUTH ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

// =====================================================
// QUIZ ROUTES
// =====================================================

app.use("/api/quizzes", quizRoutes);

// =====================================================
// USER ROUTES
// =====================================================

app.use("/api/users", userRoutes);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    message: "Internal server error",
  });
});
app.use("/api/attempts", attemptsRoutes);

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});