const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Category create
  const category = await prisma.category.upsert({
    where: {
      name: "JavaScript",
    },
    update: {},
    create: {
      name: "JavaScript",
      description: "Basic JavaScript programming concepts",
    },
  });

  // Quiz create
  const quiz = await prisma.quiz.create({
    data: {
      title: "JavaScript Basics",
      description: "Test your basic JavaScript knowledge",
      categoryId: category.id,
      difficulty: "Easy",
      duration: 10,
      passingScore: 40,
      maxAttempts: 3,
      status: "PUBLISHED",

      questions: {
        create: [
          {
            questionText: "Which keyword is used to declare a variable in JavaScript?",
            marks: 1,
            difficulty: "Easy",
            options: {
              create: [
                { optionText: "var", isCorrect: true },
                { optionText: "int", isCorrect: false },
                { optionText: "string", isCorrect: false },
                { optionText: "define", isCorrect: false },
              ],
            },
          },

          {
            questionText: "Which symbol is used for a single-line comment in JavaScript?",
            marks: 1,
            difficulty: "Easy",
            options: {
              create: [
                { optionText: "//", isCorrect: true },
                { optionText: "/*", isCorrect: false },
                { optionText: "#", isCorrect: false },
                { optionText: "<!--", isCorrect: false },
              ],
            },
          },

          {
            questionText: "Which method is used to print something in the browser console?",
            marks: 1,
            difficulty: "Easy",
            options: {
              create: [
                { optionText: "console.log()", isCorrect: true },
                { optionText: "print()", isCorrect: false },
                { optionText: "display()", isCorrect: false },
                { optionText: "writeConsole()", isCorrect: false },
              ],
            },
          },

          {
            questionText: "Which of these is a JavaScript data type?",
            marks: 1,
            difficulty: "Easy",
            options: {
              create: [
                { optionText: "Boolean", isCorrect: true },
                { optionText: "HTML", isCorrect: false },
                { optionText: "CSS", isCorrect: false },
                { optionText: "HTTP", isCorrect: false },
              ],
            },
          },

          {
            questionText: "Which operator is used for strict equality in JavaScript?",
            marks: 1,
            difficulty: "Easy",
            options: {
              create: [
                { optionText: "===", isCorrect: true },
                { optionText: "=", isCorrect: false },
                { optionText: "==", isCorrect: false },
                { optionText: "!=", isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Quiz created successfully!");
  console.log("Quiz ID:", quiz.id);
  console.log("Quiz Title:", quiz.title);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });