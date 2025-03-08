import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import logo1 from "../../assets/CollogeLogo.png";
import { CiLogin } from "react-icons/ci";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleUserClick = () => {
    if (token) {
      navigate("/dashboard"); // Redirect to dashboard if logged in
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* College Logo and Title */}
        <div className="flex items-center gap-3">
          <img src={logo1} alt="College Logo" className="h-10 w-auto" />
          <h1 className="text-xl font-bold uppercase tracking-wide">
            IT Department
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {[
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
            { name: "Notice", path: "/notice" },
            { name: "Time-Table", path: "/timetable" },
            { name: "Academic", path: "/academic" },
            { name: "Gallery", path: "/gallery" },
            { name: "Mentor-Mentee", path: "/mentor-mentee" },
            { name: "Alumni", path: "/alumni" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="relative group font-semibold transition-all duration-300"
            >
              {item.name}
              <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          {token ? (
            <button className="text-white" onClick={handleUserClick}>
              <FaUserCircle size={24} />
            </button>
          ) : (
            <Link to="/login">
              <button className="text-white">
                <CiLogin size={20} />
              </button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <button
          className="absolute top-4 right-4 text-gray-800 text-3xl"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes />
        </button>

        <nav className="mt-16 flex flex-col gap-6 text-center">
          {[
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
            { name: "Notice", path: "/notice" },
            { name: "Time-Table", path: "/timetable" },
            { name: "Academic", path: "/academic" },
            { name: "Gallery", path: "/gallery" },
            { name: "Mentor-Mentee", path: "/mentor-mentee" },
            { name: "Alumni", path: "/alumni" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="text-gray-800 text-lg font-semibold hover:text-blue-600 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
