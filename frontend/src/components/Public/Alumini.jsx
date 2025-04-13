import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLinkedin, FaGraduationCap, FaEnvelope, FaPhone, FaBuilding, FaGithub, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

function Alumini() {
  const { isDarkMode } = useTheme();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alumni');
        setAlumni(response.data);
      } catch (err) {
        setError('Error fetching alumni data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const getGoogleDriveImageUrl = (url) => {
    const match = url.match(/\/d\/(.*?)\//);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const filteredAlumni = alumni.filter(alum => {
    const matchesYear = selectedYear === 'all' || alum.graduationYear === selectedYear;
    const matchesSearch = searchQuery === '' || 
      alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.position?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const uniqueYears = [...new Set(alumni.map(alum => alum.graduationYear))].sort((a, b) => b - a);

  return (
    <div className={`min-h-screen py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Our Alumni Network
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Connect with our successful graduates and explore their achievements. Our alumni network spans across various industries and sectors.
          </p>
        </motion.div>

        {/* Filters Section */}
        <div className={`mb-8 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search by name, company, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={`w-full p-3 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Graduation Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 text-red-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {error}
          </motion.div>
        )}

        {/* Alumni Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Loading alumni data...
          </motion.div>
        ) : filteredAlumni.length > 0 ? (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {filteredAlumni.map((alum, index) => (
              <motion.div
                key={alum._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isDarkMode ? 'bg-gray-800' : ''
                }`}
              >
                {/* Update the image container height from h-48 to h-64 and add aspect-ratio */}
                <div className="relative aspect-[4/3] h-64">
                  <img
                    src={getGoogleDriveImageUrl(alum.imageUrl)}
                    alt={alum.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div className={`absolute inset-0 ${
                    isDarkMode 
                      ? 'bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent' 
                      : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
                  }`}></div>
                  {/* Update the positioning of the name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-semibold text-white mb-1">{alum.name}</h3>
                    <p className="text-white/90 text-sm">{alum.department}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaGraduationCap className="text-purple-600" />
                      <span>Graduated: {alum.graduationYear}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaBuilding className="text-purple-600" />
                      <span>{alum.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-purple-600" />
                      <span>{alum.email}</span>
                    </div>
                    {alum.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="text-purple-600" />
                        <span>{alum.phone}</span>
                      </div>
                    )}
                  </div>
                  {alum.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${alum.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 ${
                        isDarkMode ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' : ''
                      }`}
                    >
                      <FaLinkedin className="text-xl" />
                      <span>View LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {searchQuery
              ? 'No alumni found matching your search criteria'
              : 'No alumni records available'}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Alumini;