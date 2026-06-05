import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Mentors from "./pages/Mentors";
import Resources from "./pages/Resources";
import Pricing from "./pages/Pricing";
import Quiz from "./pages/Quiz";
import ModuleQuiz from "./pages/ModuleQuiz";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Learning from "./pages/Learning";
import Certificate from "./pages/Certificate";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <Routes>
        {/* Routes avec Layout (navbar + sidebar) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/checkout/:courseId" element={<Checkout />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/quiz/:lessonId" element={<Quiz />} />
          <Route path="/quiz/module/:moduleId" element={<ModuleQuiz />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/learning/:courseId" element={<Learning />} />
          <Route path="/certificate/:courseId" element={<Certificate />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Routes sans navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;
