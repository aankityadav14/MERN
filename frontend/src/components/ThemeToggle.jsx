import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-50
        ${isDarkMode 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-white text-purple-600 hover:bg-gray-100'
        } transition-colors duration-200`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: isDarkMode ? 360 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="text-2xl"
      >
        {isDarkMode ? <FiSun /> : <FiMoon />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle; 