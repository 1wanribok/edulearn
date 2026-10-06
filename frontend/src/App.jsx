import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Courses from "./pages/Courses.jsx";
import Register from "./pages/Register.jsx";
import Feedback from "./pages/Feedback.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<section className="wrap"><h1>Page not found</h1></section>} />
        </Routes>
      </main>
      <footer>EduLearn · Full Stack Development mini project · React + Spring Boot + PostgreSQL</footer>
    </>
  );
}
