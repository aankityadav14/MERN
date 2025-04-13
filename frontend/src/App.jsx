import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoute from "./components/Layout.jsx/PublicLayout";
import Home from "./components/Public/Home";
import Login from "./components/Public/Login";
import PrivateRoute from "./components/Layout.jsx/PrivateLayout";
import Dashboard from "./components/Admin/Dashboard";
import About from "./components/Public/About";
import Events from "./components/Public/Events";
import NoticePage from "./components/Public/Notice";
import Timetable from "./components/Public/Timetable";
import Academic from "./components/Public/Academic";
import Gallery from "./components/Public/Gallery";
import Mentor from "./components/Public/MentorMenti";
import Alumini from "./components/Public/Alumini";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import "react-toastify/dist/ReactToastify.css";

// import Footer from "./components/Public/Footer";
// import Login from "./components/Public/Login";
function App() {
  // Fake user state (Normally, fetch from Auth Context or API)
  const [user, setUser] = useState({ role: "admin", token: "validToken" });
  return (
    <ThemeProvider>
      <Router>
        <div
          className="min-h-screen transition-colors duration-200
          dark:bg-gray-900 dark:text-white"
        >
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover={false}
          />

          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/notice" element={<NoticePage />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/academic" element={<Academic />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/mentor-mentee" element={<Mentor />} />
              <Route path="/alumni" element={<Alumini />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="Footer" element={<Footer/>}/> */}
            </Route>
            {/* Private Routes (Only Admin) */}
            <Route element={<PrivateRoute user={user} />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
          <ThemeToggle />
          <ToastContainer
            position="bottom-right"
            theme="colored"
            autoClose={3000}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
