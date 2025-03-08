import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiDownload, FiUser, FiUsers, FiBookOpen, FiCalendar } from "react-icons/fi";

const MentorMentee = () => {
  const [mentorMentees, setMentorMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorMentees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/mentor-mentee");
        setMentorMentees(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load mentor-mentee data");
        setLoading(false);
      }
    };

    fetchMentorMentees();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Mentor-Mentee System
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentorMentees.map((record) => (
            <motion.div
              key={record._id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FiUser className="text-purple-500 text-xl mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {record.mentorName}
                  </h2>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FiBookOpen className="mr-2" />
                    <span>{record.department}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    <span>{record.academicYear}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-2" />
                    <span>{record.mentees.length} Mentees</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="font-medium text-gray-700 mb-2">Mentees:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {record.mentees.map((mentee, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-500 rounded-full mr-2">
                          {mentee.name.charAt(0)}
                        </span>
                        {mentee.name} - {mentee.rollNo}
                      </li>
                    ))}
                  </ul>
                </div>

                {record.mediaUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={record.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                    >
                      <FiDownload className="mr-2" />
                      <span>Download Document</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {mentorMentees.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <FiUsers className="mx-auto text-4xl mb-4" />
            <p>No mentor-mentee records available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MentorMentee;
