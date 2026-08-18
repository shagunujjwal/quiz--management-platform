const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

const prisma = new PrismaClient();

// ======================================================
// CREATE ATTEMPT / SUBMIT QUIZ
// POST /api/attempts
// ======================================================

router.post("/", async (req, res) => {
  try {
    const {
      quizId,
      userId,
      answers,
      timeTaken = 0,
    } = req.body;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!quizId || !userId) {
      return res.status(400).json({
        message: "quizId and userId are required.",
      });
    }

    // --------------------------------------------------
    // CHECK USER
    // --------------------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // --------------------------------------------------
    // GET QUIZ WITH QUESTIONS + OPTIONS
    // --------------------------------------------------

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: Number(quizId),
      },

      include: {
        questions: {
          include: {
            options: true,
          },

          orderBy: {
            id: "asc",
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found.",
      });
    }

    // --------------------------------------------------
    // CHECK MAX ATTEMPTS
    // --------------------------------------------------

    const previousAttempts =
      await prisma.attempt.count({
        where: {
          quizId: Number(quizId),
          userId: Number(userId),
        },
      });

    if (
      quiz.maxAttempts &&
      previousAttempts >= quiz.maxAttempts
    ) {
      return res.status(400).json({
        message:
          "Maximum attempts reached for this quiz.",
      });
    }

    // --------------------------------------------------
    // CALCULATE RESULT
    // --------------------------------------------------

    let score = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;

    const answerRecords = [];

    const submittedAnswers = Array.isArray(answers)
      ? answers
      : [];

    for (const question of quiz.questions) {
      const submitted = submittedAnswers.find(
        (item) =>
          Number(item.questionId) === question.id
      );

      // ----------------------------------------------
      // UNANSWERED
      // ----------------------------------------------

      if (
        !submitted ||
        !submitted.selectedOptionId
      ) {
        unanswered++;

        answerRecords.push({
          questionId: question.id,
          selectedOptionId: null,
          isCorrect: false,
        });

        continue;
      }

      // ----------------------------------------------
      // FIND SELECTED OPTION
      // ----------------------------------------------

      const selectedOption =
        question.options.find(
          (option) =>
            option.id ===
            Number(submitted.selectedOptionId)
        );

      if (!selectedOption) {
        incorrectAnswers++;

        answerRecords.push({
          questionId: question.id,
          selectedOptionId: null,
          isCorrect: false,
        });

        continue;
      }

      // ----------------------------------------------
      // CHECK CORRECT ANSWER
      // ----------------------------------------------

      const isCorrect =
        selectedOption.isCorrect === true;

      if (isCorrect) {
        correctAnswers++;

        score += question.marks || 1;
      } else {
        incorrectAnswers++;
      }

      answerRecords.push({
        questionId: question.id,

        selectedOptionId:
          selectedOption.id,

        isCorrect: isCorrect,
      });
    }

    // --------------------------------------------------
    // TOTAL MARKS
    // --------------------------------------------------

    const totalMarks =
      quiz.questions.reduce(
        (total, question) =>
          total + (question.marks || 1),
        0
      );

    // --------------------------------------------------
    // PERCENTAGE
    // --------------------------------------------------

    const percentage =
      totalMarks > 0
        ? (score / totalMarks) * 100
        : 0;

    // --------------------------------------------------
    // PASS / FAIL
    // --------------------------------------------------

    const status =
      percentage >= quiz.passingScore
        ? "PASSED"
        : "FAILED";

    // --------------------------------------------------
    // CREATE ATTEMPT
    // --------------------------------------------------

    const attempt =
      await prisma.attempt.create({
        data: {
          quizId: Number(quizId),

          userId: Number(userId),

          score: score,

          percentage: percentage,

          correctAnswers: correctAnswers,

          incorrectAnswers:
            incorrectAnswers,

          unanswered: unanswered,

          timeTaken:
            Number(timeTaken) || 0,

          status: status,

          completedAt: new Date(),

          answers: {
            create: answerRecords,
          },
        },

        include: {
          quiz: true,

          answers: {
            include: {
              question: true,
              selectedOption: true,
            },
          },
        },
      });

    console.log(
      "ATTEMPT CREATED:",
      attempt.id
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    res.status(201).json({
      message: "Quiz submitted successfully",

      attempt: {
        id: attempt.id,

        quizId: attempt.quizId,

        userId: attempt.userId,

        score: attempt.score,

        totalMarks: totalMarks,

        percentage: attempt.percentage,

        correctAnswers:
          attempt.correctAnswers,

        incorrectAnswers:
          attempt.incorrectAnswers,

        unanswered:
          attempt.unanswered,

        status: attempt.status,

        completedAt:
          attempt.completedAt,
      },
    });
  } catch (error) {
    console.error(
      "CREATE ATTEMPT ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to submit quiz",

      error: error.message,
    });
  }
});

// ======================================================
// GET ALL ATTEMPTS
// GET /api/attempts
// ======================================================

router.get("/", async (req, res) => {
  try {
    const attempts =
      await prisma.attempt.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          quiz: {
            include: {
              questions: true,
            },
          },
        },

        orderBy: {
          completedAt: "desc",
        },
      });

    const results = attempts.map(
      (attempt) => ({
        id: attempt.id,

        score: attempt.score,

        percentage:
          attempt.percentage,

        correctAnswers:
          attempt.correctAnswers,

        incorrectAnswers:
          attempt.incorrectAnswers,

        unanswered:
          attempt.unanswered,

        status:
          attempt.status,

        timeTaken:
          attempt.timeTaken,

        completedAt:
          attempt.completedAt,

        user: attempt.user,

        quiz: {
          id: attempt.quiz.id,

          title:
            attempt.quiz.title,

          questions:
            attempt.quiz.questions.length,
        },
      })
    );

    res.json(results);
  } catch (error) {
    console.error(
      "GET ALL ATTEMPTS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to load attempts",
    });
  }
});

// ======================================================
// GET USER RESULTS
// GET /api/attempts/user/:userId
// ======================================================

router.get(
  "/user/:userId",
  async (req, res) => {
    try {
      const userId =
        Number(req.params.userId);

      if (!userId) {
        return res.status(400).json({
          message: "Invalid user ID.",
        });
      }

      const attempts =
        await prisma.attempt.findMany({
          where: {
            userId: userId,
          },

          include: {
            quiz: {
              include: {
                questions: true,
              },
            },
          },

          orderBy: {
            completedAt: "desc",
          },
        });

      const results = attempts.map(
        (attempt) => ({
          id: attempt.id,

          score: attempt.score,

          totalMarks:
            attempt.quiz.questions.reduce(
              (total, question) =>
                total +
                (question.marks || 1),
              0
            ),

          percentage:
            attempt.percentage,

          correctAnswers:
            attempt.correctAnswers,

          incorrectAnswers:
            attempt.incorrectAnswers,

          unanswered:
            attempt.unanswered,

          status:
            attempt.status,

          timeTaken:
            attempt.timeTaken,

          startedAt:
            attempt.startedAt,

          completedAt:
            attempt.completedAt,

          quiz: {
            id: attempt.quiz.id,

            title:
              attempt.quiz.title,

            questions:
              attempt.quiz.questions.length,
          },
        })
      );

      res.json(results);
    } catch (error) {
      console.error(
        "GET USER RESULTS ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load user results",

        error: error.message,
      });
    }
  }
);

// ======================================================
// GET SINGLE ATTEMPT
// GET /api/attempts/:id
// ======================================================

router.get(
  "/:id",
  async (req, res) => {
    try {
      const attemptId =
        Number(req.params.id);

      const attempt =
        await prisma.attempt.findUnique({
          where: {
            id: attemptId,
          },

          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },

            quiz: true,

            answers: {
              include: {
                question: true,

                selectedOption: true,
              },
            },
          },
        });

      if (!attempt) {
        return res.status(404).json({
          message: "Attempt not found.",
        });
      }

      res.json(attempt);
    } catch (error) {
      console.error(
        "GET ATTEMPT ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load attempt",
      });
    }
  }
);

// ======================================================
// EXPORT
// ======================================================

module.exports = router;