import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import logo from "../../assets/teachers.jpeg";
import logo1 from "../../assets/CollogeLogo.png";
import Swal from 'sweetalert2';

import { useTheme } from "../../context/ThemeContext";
const Login = ({ setUser }) => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter both email and password!',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      if (response.data.data && response.data.data.token) {
        const { token } = response.data.data;
        const { role } = response.data.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setUser({ token: token });
        
        // Show success message with Swal
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Login successful!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate("/dashboard", { replace: true });
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid response from server',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Login failed',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Left Side - Logo/Brand */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-600/90 z-10" />
        <img
          src={logo}
          alt="College"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center items-center w-full p-12 text-white">
          <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            src={logo1}
            alt="College Logo"
            className="w-50 h-50 mb-8"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4 text-center"
          >
            Welcome to IT Department
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-center text-gray-100 max-w-md"
          >
            Admin Portal for Managing Department Resources
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div
            className={`rounded-2xl p-8 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-xl`}
          >
            <div className="text-center mb-8">
              <h2
                className={`text-3xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Sign In
              </h2>
              <p
                className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Access your admin dashboard
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <label
                  className={`text-sm font-medium block mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  className={`text-sm font-medium block mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl transition-colors ${
                      isDarkMode
                        ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                disabled={isLoading}
                className={`w-full py-3 rounded-xl text-white font-medium transition-all ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                } shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiLogIn className="text-xl" />
                    <span>Sign In</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            <div className="mt-6 text-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Need access?{" "}
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Contact Administrator
                </a>
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              © {new Date().getFullYear()} Department of Information Technology
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
