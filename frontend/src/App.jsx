import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";
import Results from "./pages/Result";
import Performance from "./pages/Performance";

import AdminDashboard from "./pages/AdminDashboard";
import AddQuiz from "./pages/AddQuiz";
import EditQuiz from "./pages/EditQuiz";
import AdminResults from "./pages/AdminResults";
import UserManagement from "./pages/UserManagement";
import UserDetails from "./pages/UserDetails";

function Home() {
  return (
    <div className="min-h-screen bg-slate-100">

      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            QuizMaster
          </Link>

          <div className="flex gap-3">

            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Register
            </Link>

          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-20">

        <div className="max-w-3xl">

          <p className="mb-4 font-semibold text-blue-600">
            ONLINE ASSESSMENT PLATFORM
          </p>

          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            Test Your Knowledge.
            <br />
            Improve Your Skills.
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Take online quizzes, track your performance,
            and improve your knowledge with QuizMaster.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Get Started
          </Link>

        </div>

      </main>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* USER ROUTES */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/quiz/:id"
          element={<Quiz />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/performance"
          element={<Performance />}
        />


        {/* ADMIN ROUTES */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/add-quiz"
          element={<AddQuiz />}
        />

        <Route
          path="/admin/edit-quiz/:id"
          element={<EditQuiz />}
        />

        <Route
          path="/admin-results"
          element={<AdminResults />}
        />
        <Route
        path="/admin/users"
        element={<UserManagement/>}
        />
        <Route
        path="/admin/users/:id"
        element={<UserDetails/>}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;