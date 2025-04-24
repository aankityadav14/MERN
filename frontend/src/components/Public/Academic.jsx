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
  
  // Update filter states to match AcademicForm
  const [filters, setFilters] = useState({
    year: '',
    semester: '',
    type: ''
  });

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

  // Update filtered academics logic
  const filteredAcademics = academics.filter(academic => {
    const matchesYear = !filters.year || academic.year === filters.year;
    const matchesSemester = !filters.semester || academic.semester === filters.semester;
    const matchesType = !filters.type || academic.type === filters.type;
    
    return matchesYear && matchesSemester && matchesType;
  });

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

        {/* Updated Filter Section */}
        <div className={`mb-8 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Year Filter */}
            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">All Years</option>
              <option value="First Year">First Year</option>
              <option value="Second Year">Second Year</option>
              <option value="Third Year">Third Year</option>
              <option value="MSc Part 1">MSc Part 1</option>
              <option value="MSc Part 2">MSc Part 2</option>
            </select>

            {/* Semester Filter */}
            <select
              value={filters.semester}
              onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">All Semesters</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4</option>
              <option value="semester 5">Semester 5</option>
              <option value="semester 6">Semester 6</option>
              <option value="part 1">Part 1</option>
              <option value="part 2">Part 2</option>
            </select>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">All Types</option>
              <option value="syllabus">Syllabus</option>
              <option value="notes">Notes</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {(filters.year || filters.semester || filters.type) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Active filters:
              </span>
              {filters.year && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  Year: {filters.year}
                  <FaTimes 
                    className="ml-2 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, year: '' }))}
                  />
                </span>
              )}
              {filters.semester && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  Semester: {filters.semester}
                  <FaTimes 
                    className="ml-2 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, semester: '' }))}
                  />
                </span>
              )}
              {filters.type && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  Type: {filters.type}
                  <FaTimes 
                    className="ml-2 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, type: '' }))}
                  />
                </span>
              )}
              {/* Clear All Filters */}
              <button
                onClick={() => setFilters({ year: '', semester: '', type: '' })}
                className="text-sm text-purple-500 hover:text-purple-600 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
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
