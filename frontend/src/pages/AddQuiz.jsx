AddQuiz.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddQuiz() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [duration, setDuration] = useState(10);

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      answer: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

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

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      alert("At least one question is required.");
      return;
    }

    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];

    updated[questionIndex].options[optionIndex] = value;

    setQuestions(updated);
  };

  const updateAnswer = (index, value) => {
    const updated = [...questions];
    updated[index].answer = value;
    setQuestions(updated);
  };

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

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        alert(`Please enter Question ${i + 1}.`);
        return;
      }

      if (questions[i].options.some((option) => !option.trim())) {
        alert(`Please fill all options for Question ${i + 1}.`);
        return;
      }

      if (!questions[i].answer) {
        alert(`Please select correct answer for Question ${i + 1}.`);
        return;
      }
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://quiz-management-platform-hg8y.onrender.com/api/quizzes",
        {
          title,
          description,
          category,
          difficulty,
          duration: Number(duration),
          questions,
        }
      );

      console.log("Quiz created:", response.data);

      alert("Quiz added successfully! 🎉");

      navigate("/admin-dashboard");
    } catch (error) {
      console.error("ADD QUIZ ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to add quiz. Please check backend server."
      );
    } finally {
      setLoading(false);
    }
  };

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
            Add New Quiz
          </h2>

          <p className="mt-2 text-slate-600">
            Create a new quiz with questions and answers.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Quiz Information */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold text-slate-900">
              Quiz Information
            </h3>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div className="md:col-span-2">
                <label className="font-semibold text-slate-700">
                  Quiz Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Computer Fundamentals Quiz"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter quiz description"
                  rows="3"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Computer"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  Difficulty
                </label>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  Duration (minutes)
                </label>

                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
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

            {questions.map((item, questionIndex) => (

              <div
                key={questionIndex}
                className="mb-6 rounded-xl bg-white p-6 shadow-sm"
              >

                <div className="flex items-center justify-between">

                  <h4 className="text-lg font-bold text-blue-600">
                    Question {questionIndex + 1}
                  </h4>

                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
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
                      updateQuestion(questionIndex, e.target.value)
                    }
                    placeholder="Enter your question"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />

                </div>

                {/* Options */}
                <div className="mt-5">

                  <label className="font-semibold text-slate-700">
                    Options
                  </label>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">

                    {item.options.map((option, optionIndex) => (

                      <div key={optionIndex}>

                        <input
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

                      </div>

                    ))}

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
                      updateAnswer(questionIndex, e.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="">
                      Select correct answer
                    </option>

                    {item.options.map((option, optionIndex) => (

                      <option
                        key={optionIndex}
                        value={option}
                        disabled={!option.trim()}
                      >
                        Option {String.fromCharCode(65 + optionIndex)}
                        {option ? ` - ${option}` : ""}
                      </option>

                    ))}

                  </select>

                </div>

              </div>

            ))}

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? "Saving Quiz..." : "Save Quiz"}
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

export default AddQuiz;