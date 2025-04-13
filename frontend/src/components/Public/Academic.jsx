import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilePdf, FaFileWord, FaDownload, FaFilter, FaTimes, FaBook } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { getAcademicInfo, getDepartmentInfo, getSyllabus } from '../../api/publicapi';

const Academic = () => {
  const { isDarkMode } = useTheme();
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeYear, setActiveYear] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAcademics = async () => {
      try {
        setLoading(true);
        const data = await getAcademicInfo();
        setAcademics(data);
        setError(null);
      } catch (err) {
        setError("Unable to load resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcademics();
  }, []);

  const getFilteredAcademics = () => {
    return academics.filter(academic => {
      const matchesYear = activeYear === 'all' || academic.year === activeYear;
      const matchesType = activeType === 'all' || academic.type === activeType;
      return matchesYear && matchesType;
    });
  };

  const filteredAcademics = getFilteredAcademics();

  const handleYearChange = (year) => {
    setActiveYear(year);
    setActiveType('all');
  };

  const getFileIcon = (mediaUrl) => {
    if (mediaUrl.toLowerCase().includes('.pdf')) {
      return <FaFilePdf className="text-red-500 text-xl" />;
    }
    return <FaFileWord className="text-blue-500 text-xl" />;
  };

  return (
    <div className={`min-h-screen py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Academic Resources
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Access study materials, notes, and resources for your academic journey
          </p>
        </motion.div>

        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${
              isDarkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } transition-colors duration-300`}
          >
            <FaFilter />
            <span>Filter Resources</span>
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-6 rounded-xl mb-6 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Year Filter */}
                  <div>
                    <label className={`block mb-2 font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Select Year
                    </label>
                    <select
                      value={activeYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      className={`w-full p-3 rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white border-gray-600' 
                          : 'bg-gray-50 text-gray-900 border-gray-300'
                      } focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">All Years</option>
                      <option value="FY">First Year</option>
                      <option value="SY">Second Year</option>
                      <option value="TY">Third Year</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className={`block mb-2 font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Resource Type
                    </label>
                    <select
                      value={activeType}
                      onChange={(e) => setActiveType(e.target.value)}
                      className={`w-full p-3 rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white border-gray-600' 
                          : 'bg-gray-50 text-gray-900 border-gray-300'
                      } focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">All Types</option>
                      <option value="notes">Notes</option>
                      <option value="syllabus">Syllabus</option>
                      <option value="question-papers">Question Papers</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters */}
                {(activeYear || activeType) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeYear && (
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {activeYear}
                        <button
                          onClick={() => handleYearChange('all')}
                          className="hover:text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    )}
                    {activeType && (
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {activeType}
                        <button
                          onClick={() => setActiveType('all')}
                          className="hover:text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-red-500"
          >
            {error}
          </motion.div>
        )}

        {/* Content Section */}
        <div className="mt-8">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`col-span-full text-center py-12 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Loading resources...
            </motion.div>
          ) : filteredAcademics.length > 0 ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {filteredAcademics.map((academic, index) => (
                <motion.div
                  key={academic._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600 font-medium">
                        {academic.type.charAt(0).toUpperCase() + academic.type.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">{academic.year}</span>
                    </div>
                    <h3 className={`text-xl font-semibold text-gray-800 mb-2 ${
                      isDarkMode ? 'text-white' : ''
                    }`}>
                      {academic.title}
                    </h3>
                    <p className="text-gray-600 mb-4">Subject: {academic.subject}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(academic.mediaUrl)}
                        <span className="text-sm text-gray-500">
                          {new Date(academic.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <a
                        href={academic.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 ${
                          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : ''
                        }`}
                      >
                        <FaDownload />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`col-span-full text-center py-12 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              No resources found
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Academic;
