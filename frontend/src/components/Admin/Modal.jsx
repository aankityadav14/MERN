import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Modal = ({ isOpen, onClose, children }) => {
  const { isDarkMode } = useTheme();
  
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className={`relative rounded-lg p-8 max-w-4xl w-full ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <button
            className={`absolute top-4 right-4 ${
              isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'
            }`}
            onClick={onClose}
          >
            <span className="text-2xl">&times;</span>
          </button>
          <div className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Modal;