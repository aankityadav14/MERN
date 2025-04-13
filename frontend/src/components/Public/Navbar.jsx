import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaHome, FaBullhorn, FaClock, FaBook, FaImages, FaUserFriends, FaGraduationCap } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { useTheme } from "../../context/ThemeContext";
import logo1 from "../../assets/CollogeLogo.png";

const Navbar = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleUserClick = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: FaHome },
    { name: "Notice", path: "/notice", icon: FaBullhorn },
    { name: "Time-Table", path: "/timetable", icon: FaClock },
    { name: "Academic", path: "/academic", icon: FaBook },
    { name: "Gallery", path: "/gallery", icon: FaImages },
    { name: "Mentor-Mentee", path: "/mentor-mentee", icon: FaUserFriends },
    { name: "Alumni", path: "/alumni", icon: FaGraduationCap },
  ];

  return (
    <header 
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? isDarkMode 
            ? "bg-gray-900 shadow-lg shadow-gray-800/50" 
            : "bg-white shadow-lg"
          : isDarkMode
            ? "bg-gradient-to-r from-blue-900 to-indigo-900"
            : "bg-gradient-to-r from-blue-600 to-indigo-600"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo1} alt="College Logo" className="h-10 w-auto" />
            <h1 className={`text-xl font-bold uppercase tracking-wide ${
              scrolled 
                ? isDarkMode ? "text-white" : "text-gray-800"
                : "text-white"
            }`}>
              IT Department
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative group flex items-center space-x-2 font-medium transition-colors duration-300 ${
                  scrolled 
                    ? isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-blue-600"
                    : "text-white hover:text-blue-200"
                }`}
              >
                <item.icon className="text-lg" />
                <span>{item.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            {token ? (
              <button
                onClick={handleUserClick}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  scrolled 
                    ? isDarkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <FaUserCircle size={24} />
              </button>
            ) : (
              <Link to="/login">
                <button
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    scrolled 
                      ? isDarkMode
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <CiLogin size={24} />
                </button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
              scrolled 
                ? isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-72 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        } ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <h2 className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}>Menu</h2>
          <button
            className={`p-2 rounded-lg transition-colors duration-300 ${
              isDarkMode 
                ? "hover:bg-gray-800 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            onClick={() => setIsOpen(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300 ${
                location.pathname === item.path
                  ? isDarkMode
                    ? "bg-gray-800 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                  : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="text-xl" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          {token ? (
            <button
              onClick={() => {
                handleUserClick();
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaUserCircle size={24} />
              <span className="font-medium">Dashboard</span>
            </button>
          ) : (
            <Link
              to="/login"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <CiLogin size={24} />
              <span className="font-medium">Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
