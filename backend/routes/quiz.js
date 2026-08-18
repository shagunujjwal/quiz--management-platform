const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// ======================================================
// GET ALL QUIZZES
// GET /api/quizzes
// ======================================================

router.get("/", async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        category: true,
        questions: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    const result = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category?.name || "General",
      categoryId: quiz.categoryId,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      status: quiz.status,
      questions: quiz.questions.length,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    }));

    res.json(result);
  } catch (error) {
    console.error("GET QUIZZES ERROR:", error);

    res.status(500).json({
      message: "Failed to load quizzes",
      error: error.message,
    });
  }
});

// ======================================================
// GET SINGLE QUIZ
// GET /api/quizzes/:id
// ======================================================

router.get("/:id", async (req, res) => {
  try {
    const quizId = Number(req.params.id);

    if (Number.isNaN(quizId)) {
      return res.status(400).json({
        message: "Invalid quiz ID",
      });
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },

      include: {
        category: true,

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
        message: "Quiz not found",
      });
    }

    const result = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category?.name || "General",
      categoryId: quiz.categoryId,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      status: quiz.status,

      questions: quiz.questions.map((question) => ({
        id: question.id,

        question: question.questionText,

        questionText: question.questionText,

        marks: question.marks,

        explanation: question.explanation,

        difficulty: question.difficulty,

        options: question.options.map(
          (option) => option.optionText
        ),

        optionObjects: question.options.map(
          (option) => ({
            id: option.id,
            optionText: option.optionText,
            isCorrect: option.isCorrect,
          })
        ),

        answer:
          question.options.find(
            (option) => option.isCorrect === true
          )?.optionText || "",
      })),
    };

    console.log(
      "QUIZ LOADED:",
      result.id,
      result.title
    );

    res.json(result);
  } catch (error) {
    console.error("GET SINGLE QUIZ ERROR:", error);

    res.status(500).json({
      message: "Failed to load quiz",
      error: error.message,
    });
  }
});

// ======================================================
// CREATE QUIZ
// POST /api/quizzes
// ======================================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      passingScore,
      maxAttempts,
      questions,
    } = req.body;

    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (!title || !description || !category) {
      return res.status(400).json({
        message:
          "Title, description and category are required.",
      });
    }

    if (
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        message:
          "At least one question is required.",
      });
    }

    // -------------------------------
    // FIND / CREATE CATEGORY
    // -------------------------------

    let categoryRecord =
      await prisma.category.findUnique({
        where: {
          name: category.trim(),
        },
      });

    if (!categoryRecord) {
      categoryRecord =
        await prisma.category.create({
          data: {
            name: category.trim(),
            description:
              `${category.trim()} quizzes`,
          },
        });
    }

    // -------------------------------
    // CREATE QUIZ
    // -------------------------------

    const newQuiz =
      await prisma.quiz.create({
        data: {
          title: title.trim(),

          description:
            description.trim(),

          categoryId:
            categoryRecord.id,

          difficulty:
            difficulty || "Easy",

          duration:
            Number(duration) || 10,

          passingScore:
            Number(passingScore) || 50,

          maxAttempts:
            Number(maxAttempts) || 3,

          status: "PUBLISHED",

          questions: {
            create: questions.map((item) => ({
              questionText:
                item.question ||
                item.questionText ||
                "",

              marks:
                Number(item.marks) || 1,

              explanation:
                item.explanation || null,

              difficulty:
                item.difficulty ||
                difficulty ||
                "Easy",

              options: {
                create:
                  Array.isArray(item.options)
                    ? item.options.map(
                        (option) => ({
                          optionText:
                            typeof option ===
                            "string"
                              ? option
                              : option.optionText,

                          isCorrect:
                            typeof option ===
                            "string"
                              ? option ===
                                item.answer
                              : option.isCorrect ===
                                  true ||
                                option.optionText ===
                                  item.answer,
                        })
                      )
                    : [],
              },
            })),
          },
        },

        include: {
          category: true,

          questions: {
            include: {
              options: true,
            },
          },
        },
      });

    console.log(
      "NEW QUIZ CREATED:",
      newQuiz.id
    );

    res.status(201).json({
      message: "Quiz added successfully",
      quiz: newQuiz,
    });
  } catch (error) {
    console.error("ADD QUIZ ERROR:", error);

    res.status(500).json({
      message: "Failed to add quiz",
      error: error.message,
    });
  }
});

// ======================================================
// UPDATE QUIZ
// PUT /api/quizzes/:id
// ======================================================

router.put("/:id", async (req, res) => {
  try {
    const quizId = Number(req.params.id);

    if (Number.isNaN(quizId)) {
      return res.status(400).json({
        message: "Invalid quiz ID",
      });
    }

    const {
      title,
      description,
      category,
      difficulty,
      duration,
      passingScore,
      maxAttempts,
      questions,
    } = req.body;

    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (!title || !description || !category) {
      return res.status(400).json({
        message:
          "Title, description and category are required.",
      });
    }

    if (
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        message:
          "At least one question is required.",
      });
    }

    // -------------------------------
    // CHECK QUIZ
    // -------------------------------

    const existingQuiz =
      await prisma.quiz.findUnique({
        where: {
          id: quizId,
        },
      });

    if (!existingQuiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    // -------------------------------
    // FIND / CREATE CATEGORY
    // -------------------------------

    let categoryRecord =
      await prisma.category.findUnique({
        where: {
          name: category.trim(),
        },
      });

    if (!categoryRecord) {
      categoryRecord =
        await prisma.category.create({
          data: {
            name: category.trim(),
            description:
              `${category.trim()} quizzes`,
          },
        });
    }

    // ==================================================
    // IMPORTANT
    // Delete old attempts before deleting questions
    // ==================================================

    const oldAttempts =
      await prisma.attempt.findMany({
        where: {
          quizId: quizId,
        },

        select: {
          id: true,
        },
      });

    const oldAttemptIds =
      oldAttempts.map(
        (attempt) => attempt.id
      );

    // -------------------------------
    // DELETE OLD ANSWERS
    // -------------------------------

    if (oldAttemptIds.length > 0) {
      await prisma.answer.deleteMany({
        where: {
          attemptId: {
            in: oldAttemptIds,
          },
        },
      });
    }

    // -------------------------------
    // DELETE OLD ATTEMPTS
    // -------------------------------

    await prisma.attempt.deleteMany({
      where: {
        quizId: quizId,
      },
    });

    // -------------------------------
    // DELETE OLD QUESTIONS
    // -------------------------------

    await prisma.question.deleteMany({
      where: {
        quizId: quizId,
      },
    });

    // -------------------------------
    // UPDATE QUIZ
    // -------------------------------

    const updatedQuiz =
      await prisma.quiz.update({
        where: {
          id: quizId,
        },

        data: {
          title: title.trim(),

          description:
            description.trim(),

          categoryId:
            categoryRecord.id,

          difficulty:
            difficulty || "Easy",

          duration:
            Number(duration) || 10,

          passingScore:
            Number(passingScore) || 50,

          maxAttempts:
            Number(maxAttempts) || 3,

          questions: {
            create: questions.map((item) => ({
              questionText:
                item.question ||
                item.questionText ||
                "",

              marks:
                Number(item.marks) || 1,

              explanation:
                item.explanation || null,

              difficulty:
                item.difficulty ||
                difficulty ||
                "Easy",

              options: {
                create:
                  Array.isArray(item.options)
                    ? item.options.map(
                        (option) => ({
                          optionText:
                            typeof option ===
                            "string"
                              ? option
                              : option.optionText,

                          isCorrect:
                            typeof option ===
                            "string"
                              ? option ===
                                item.answer
                              : option.isCorrect ===
                                  true ||
                                option.optionText ===
                                  item.answer,
                        })
                      )
                    : [],
              },
            })),
          },
        },

        include: {
          category: true,

          questions: {
            include: {
              options: true,
            },
          },
        },
      });

    console.log(
      "QUIZ UPDATED:",
      updatedQuiz.id
    );

    res.json({
      message:
        "Quiz updated successfully",

      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error(
      "UPDATE QUIZ ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update quiz",

      error: error.message,
    });
  }
});

// ======================================================
// DELETE QUIZ
// DELETE /api/quizzes/:id
// ======================================================

router.delete("/:id", async (req, res) => {
  try {
    const quizId = Number(req.params.id);

    if (Number.isNaN(quizId)) {
      return res.status(400).json({
        message: "Invalid quiz ID",
      });
    }

    // -------------------------------
    // CHECK QUIZ
    // -------------------------------

    const existingQuiz =
      await prisma.quiz.findUnique({
        where: {
          id: quizId,
        },
      });

    if (!existingQuiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    // ==================================================
    // STEP 1: FIND ATTEMPTS
    // ==================================================

    const attempts =
      await prisma.attempt.findMany({
        where: {
          quizId: quizId,
        },

        select: {
          id: true,
        },
      });

    const attemptIds =
      attempts.map(
        (attempt) => attempt.id
      );

    // ==================================================
    // STEP 2: DELETE ANSWERS
    // ==================================================

    if (attemptIds.length > 0) {
      await prisma.answer.deleteMany({
        where: {
          attemptId: {
            in: attemptIds,
          },
        },
      });
    }

    // ==================================================
    // STEP 3: DELETE ATTEMPTS
    // ==================================================

    await prisma.attempt.deleteMany({
      where: {
        quizId: quizId,
      },
    });

    // ==================================================
    // STEP 4: DELETE QUESTIONS
    // ==================================================

    await prisma.question.deleteMany({
      where: {
        quizId: quizId,
      },
    });

    // ==================================================
    // STEP 5: DELETE QUIZ
    // ==================================================

    await prisma.quiz.delete({
      where: {
        id: quizId,
      },
    });

    console.log(
      "QUIZ DELETED:",
      quizId
    );

    res.json({
      message:
        "Quiz deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE QUIZ ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete quiz",

      error: error.message,
    });
  }
});

// ======================================================
// EXPORT
// ======================================================

module.exports = router;