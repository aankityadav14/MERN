import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilePdf, FaCalendarAlt, FaUserGraduate, FaSearch, FaFilter, FaDownload } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { getTimetableData, getTimetableByClass, getTimetableByTeacher } from '../../api/publicapi';

const Timetable = () => {
  const { isDarkMode } = useTheme();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const data = await getTimetableData();
        setTimetable(data);
      } catch (err) {
        setError("Error fetching timetable.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  // Function to extract Google Drive File ID and generate direct view URL
  const getGoogleDriveFileId = (url) => {
    if (url.includes("drive.google.com")) {
      return url.match(/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
    }
    return null;
  };

  const formatMediaUrl = (url) => {
    const fileId = getGoogleDriveFileId(url);
    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return url;
  };

  const filteredTimetable = timetable.filter(entry => {
    const matchesYear = selectedYear === 'all' || entry.year === selectedYear;
    const matchesSearch = searchQuery === '' || 
      entry.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.year.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const uniqueYears = [...new Set(timetable.map(entry => entry.year))].sort();

  return (
    <div className={`min-h-screen py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Class Timetable
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Access and download class schedules for different academic years. Stay organized with our comprehensive timetable system.
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`bg-white rounded-2xl shadow-lg p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : ''}`}
        >
          <div className="flex flex-wrap gap-4">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search by faculty name or year..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    isDarkMode ? 'bg-gray-700 text-white' : ''
                  }`}
                />
              </div>
            </div>

            {/* Year Filter */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FaFilter className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none ${
                    isDarkMode ? 'bg-gray-700 text-white' : ''
                  }`}
                >
                  <option value="all">All Years</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-red-600 text-center bg-red-100 p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-gray-800' : ''}`}
          >
            {error}
          </motion.div>
        )}

        {/* Timetable Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredTimetable.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTimetable.map((entry, index) => {
              const fileId = getGoogleDriveFileId(entry.media);
              const formattedUrl = formatMediaUrl(entry.media);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    isDarkMode ? 'bg-gray-800' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <FaCalendarAlt className="text-purple-600 text-xl" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">Year: {entry.year}</h2>
                          <p className="text-gray-600 text-sm">Faculty: {entry.facultyName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaFilePdf className="text-red-500 text-xl" />
                      </div>
                    </div>

                    <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden mb-4">
                      {entry.media.endsWith(".pdf") || fileId ? (
                        <iframe
                          src={`https://drive.google.com/file/d/${fileId}/preview`}
                          className="w-full h-full"
                          title={`Timetable PDF ${index}`}
                          sandbox="allow-scripts allow-same-origin"
                        />
                      ) : (
                        <img
                          src={formattedUrl}
                          alt={`Timetable Media ${index}`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaUserGraduate className="text-purple-600" />
                        <span>{entry.facultyName}</span>
                      </div>
                      <a
                        href={`https://drive.google.com/file/d/${fileId}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300"
                      >
                        <FaFilePdf className="text-xl" />
                        <span>View PDF</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg"
          >
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? 'No timetable found matching your search criteria'
                : 'No timetable available'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Timetable;
