import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaUserTie, FaUsers, FaSearch, FaArrowRight } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const MentorMenti = () => {
  const { isDarkMode } = useTheme();
  const [mentorMentees, setMentorMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    const fetchMentorMentees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/mentor-mentee");
        setMentorMentees(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load mentor-mentee data");
        console.error("Error fetching mentor-mentee data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorMentees();
  }, []);

  const departments = [...new Set(mentorMentees.map(item => item.department))];

  const filteredMentorMentees = mentorMentees.filter(item => {
    const matchesSearch = searchQuery.toLowerCase() === "" ||
      item.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mentees.some(mentee => mentee.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDepartment = selectedDepartment === "" || item.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

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
            Mentor-Mentee Program
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Supporting student growth through dedicated mentorship
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <div className={`mb-8 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search by mentor or mentee name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className={`w-full p-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
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
            Loading mentor-mentee data...
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-red-500"
          >
            {error}
          </motion.div>
        ) : filteredMentorMentees.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            No mentor-mentee pairs found
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentorMentees.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-xl overflow-hidden shadow-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } transition-all duration-300`}
              >
                {/* Mentor Section */}
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                    }`}>
                      <FaUserTie className="text-2xl text-blue-600" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.mentorName}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.department}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.mentorEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mentees Section */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaUsers className="text-blue-600" />
                    <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Mentees ({item.mentees.length})
                    </h4>
                  </div>
                  <div className="space-y-4">
                    {item.mentees.map((mentee) => (
                      <div
                        key={mentee._id}
                        className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {mentee.name}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Roll No: {mentee.rollNo}
                        </p>
                        
                      </div>
                     
                      
                    ))}
                    <p className="flex items-center gap-1">
                      <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="text-blue-500">
                        View Media
                        <FaArrowRight className="inline-block ml-1" />
                      </a>
                    </p>
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

export default MentorMenti;
