import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [duration, setDuration] = useState(10);

  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD QUIZ
  // ==========================================

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${id}`
        );

        const quiz = response.data;

        setTitle(quiz.title || "");
        setDescription(quiz.description || "");
        setCategory(quiz.category || "");
        setDifficulty(quiz.difficulty || "Easy");
        setDuration(quiz.duration || 10);

        setQuestions(
          (quiz.questions || []).map((item) => ({
            question: item.question || "",
            options: item.options || ["", "", "", ""],
            answer: item.answer || "",
          }))
        );
      } catch (error) {
        console.error("LOAD EDIT QUIZ ERROR:", error);

        alert(
          error.response?.data?.message ||
            "Unable to load quiz."
        );

        navigate("/admin-dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id, navigate]);

  // ==========================================
  // ADD QUESTION
  // ==========================================

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
      },
    ]);
  };

  // ==========================================
  // DELETE QUESTION
  // ==========================================

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      alert("At least one question is required.");
      return;
    }

    setQuestions(
      questions.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // UPDATE QUESTION
  // ==========================================

  const updateQuestion = (index, value) => {
    const updated = [...questions];

    updated[index].question = value;

    setQuestions(updated);
  };

  // ==========================================
  // UPDATE OPTION
  // ==========================================

  const updateOption = (
    questionIndex,
    optionIndex,
    value
  ) => {
    const updated = [...questions];

    updated[questionIndex].options[optionIndex] = value;

    // Agar selected answer change ho gaya hai
    // to old answer remove kar do
    if (
      updated[questionIndex].answer &&
      updated[questionIndex].answer !== value &&
      updated[questionIndex].answer ===
        questions[questionIndex].options[optionIndex]
    ) {
      updated[questionIndex].answer = "";
    }

    setQuestions(updated);
  };

  // ==========================================
  // UPDATE ANSWER
  // ==========================================

  const updateAnswer = (index, value) => {
    const updated = [...questions];

    updated[index].answer = value;

    setQuestions(updated);
  };

  // ==========================================
  // SAVE CHANGES
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter quiz title.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter quiz description.");
      return;
    }

    if (!category.trim()) {
      alert("Please enter category.");
      return;
    }

    if (questions.length === 0) {
      alert("At least one question is required.");
      return;
    }

    // Validate questions

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        alert(`Please enter Question ${i + 1}.`);
        return;
      }

      if (
        questions[i].options.some(
          (option) => !option.trim()
        )
      ) {
        alert(
          `Please fill all options for Question ${
            i + 1
          }.`
        );
        return;
      }

      if (!questions[i].answer) {
        alert(
          `Please select correct answer for Question ${
            i + 1
          }.`
        );
        return;
      }
    }

    try {
      setSaving(true);

      const response = await axios.put(
        `http://localhost:5000/api/quizzes/${id}`,
        {
          title,
          description,
          category,
          difficulty,
          duration: Number(duration),
          questions,
        }
      );

      console.log(
        "QUIZ UPDATED:",
        response.data
      );

      alert("Quiz updated successfully! 🎉");

      navigate("/admin-dashboard");
    } catch (error) {
      console.error(
        "UPDATE QUIZ ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update quiz."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="text-5xl">⏳</div>

          <p className="mt-3 text-lg font-semibold text-slate-600">
            Loading quiz...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}

      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <h1 className="text-2xl font-bold text-blue-600">
            QuizMaster Admin
          </h1>

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-300"
          >
            Back to Admin
          </button>

        </div>
      </nav>

      {/* Main */}

      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Edit Quiz
          </h2>

          <p className="mt-2 text-slate-600">
            Update quiz information, questions and answers.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Quiz Information */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold text-slate-900">
              Quiz Information
            </h3>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              {/* Title */}

              <div className="md:col-span-2">

                <label className="font-semibold text-slate-700">
                  Quiz Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              {/* Description */}

              <div className="md:col-span-2">

                <label className="font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows="3"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              {/* Category */}

              <div>

                <label className="font-semibold text-slate-700">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              {/* Difficulty */}

              <div>

                <label className="font-semibold text-slate-700">
                  Difficulty
                </label>

                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>

              </div>

              {/* Duration */}

              <div>

                <label className="font-semibold text-slate-700">
                  Duration (minutes)
                </label>

                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

            </div>

          </div>

          {/* Questions */}

          <div className="mt-8">

            <div className="mb-5 flex items-center justify-between">

              <h3 className="text-2xl font-bold text-slate-900">
                Questions ({questions.length})
              </h3>

              <button
                type="button"
                onClick={addQuestion}
                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                + Add Question
              </button>

            </div>

            {questions.map(
              (item, questionIndex) => (

                <div
                  key={questionIndex}
                  className="mb-6 rounded-xl bg-white p-6 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <h4 className="text-lg font-bold text-blue-600">
                      Question{" "}
                      {questionIndex + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        removeQuestion(
                          questionIndex
                        )
                      }
                      className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200"
                    >
                      Delete
                    </button>

                  </div>

                  {/* Question */}

                  <div className="mt-5">

                    <label className="font-semibold text-slate-700">
                      Question
                    </label>

                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />

                  </div>

                  {/* Options */}

                  <div className="mt-5">

                    <label className="font-semibold text-slate-700">
                      Options
                    </label>

                    <div className="mt-3 grid gap-3 md:grid-cols-2">

                      {item.options.map(
                        (
                          option,
                          optionIndex
                        ) => (

                          <input
                            key={optionIndex}
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Option ${String.fromCharCode(
                              65 + optionIndex
                            )}`}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                          />

                        )
                      )}

                    </div>

                  </div>

                  {/* Correct Answer */}

                  <div className="mt-5">

                    <label className="font-semibold text-slate-700">
                      Correct Answer
                    </label>

                    <select
                      value={item.answer}
                      onChange={(e) =>
                        updateAnswer(
                          questionIndex,
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    >

                      <option value="">
                        Select correct answer
                      </option>

                      {item.options.map(
                        (
                          option,
                          optionIndex
                        ) => (

                          <option
                            key={optionIndex}
                            value={option}
                            disabled={!option.trim()}
                          >
                            Option{" "}
                            {String.fromCharCode(
                              65 + optionIndex
                            )}
                            {option
                              ? ` - ${option}`
                              : ""}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                </div>

              )
            )}

          </div>

          {/* Buttons */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {saving
                ? "Updating Quiz..."
                : "Update Quiz"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin-dashboard")}
              className="flex-1 rounded-lg bg-slate-300 py-3 font-semibold text-slate-700 hover:bg-slate-400"
            >
              Cancel
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default EditQuiz;