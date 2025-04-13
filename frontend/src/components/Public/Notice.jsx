import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiDownload, FiCalendar, FiUser, FiFileText, FiSearch } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const NoticePage = () => {
  const { isDarkMode } = useTheme();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notices");
        setNotices(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load notices");
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const categories = [...new Set(notices.map(notice => notice.category))];

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = searchQuery.toLowerCase() === "" ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.issuedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "" || notice.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Notice Board
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Stay updated with the latest announcements and notifications
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <div className={`mb-8 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full p-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Loading notices...
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-red-500"
          >
            {error}
          </motion.div>
        ) : filteredNotices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            No notices found
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredNotices.map((notice, index) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-xl overflow-hidden shadow-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } transition-all duration-300`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className={`text-xl font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {notice.title}
                    </h3>
                    <div className={`flex items-center gap-2 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <FiCalendar />
                      <span>{formatDate(notice.createdAt)}</span>
                    </div>
                  </div>

                  <div className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p className="whitespace-pre-wrap">{notice.content}</p>
                  </div>

                  <div className={`mt-6 pt-4 border-t ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className={`flex items-center gap-2 text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <FiUser />
                        <span>Issued by: {notice.issuedBy}</span>
                      </div>

                      {notice.fileUrl && (
                        <a
                          href={notice.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          <FiFileText />
                          <span>View Attachment</span>
                          <FiDownload />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticePage;
