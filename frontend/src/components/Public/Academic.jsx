import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilePdf, FaFileWord, FaDownload } from "react-icons/fa";

const Academic = () => {
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeYear, setActiveYear] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);

  useEffect(() => {
    const fetchAcademics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/academic');
        setAcademics(response.data);
        setError(null);
      } catch (err) {
        setError("Unable to load resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcademics();
  }, []); // Remove dependency on filters since we'll filter client-side

  // Add this filtering function
  const getFilteredAcademics = () => {
    return academics.filter(academic => {
      const matchesYear = activeYear === 'all' || academic.year === activeYear;
      const matchesType = activeType === 'all' || academic.type === activeType;
      return matchesYear && matchesType;
    });
  };

  // Update the content section to use filtered results
  const filteredAcademics = getFilteredAcademics();

  // Reset type filter when year changes
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-purple-800 mb-8">
          Academic Resources
        </h1>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg mb-1 flex ">
          {/* Year Filter Accordion */}
          <div className="p-4">
            <button
              onClick={() => setIsYearFilterOpen(!isYearFilterOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="font-medium text-gray-700">Select Year</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  isYearFilterOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isYearFilterOpen && (
              <div className="mt-4 space-y-2 px-4">
                {['First Year', 'Second Year', 'Third Year', 'MSc Part 1', 'MSc Part 2'].map((year) => (
                  <label key={year} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="year"
                      checked={activeYear === year}
                      onChange={() => handleYearChange(year)}
                      className="form-radio h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                    />
                    <span className="text-gray-700">{year}</span>
                  </label>
                ))}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="year"
                    checked={activeYear === 'all'}
                    onChange={() => handleYearChange('all')}
                    className="form-radio h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                  />
                  <span className="text-gray-700">Show All</span>
                </label>
              </div>
            )}
          </div>

          {/* Type Filter Accordion */}
          <div className="p-4">
            <button
              onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="font-medium text-gray-700">Resource Type</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  isTypeFilterOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isTypeFilterOpen && (
              <div className="mt-4 space-y-2 px-4">
                {[
                  { id: 'all', label: 'All Resources' },
                  { id: 'syllabus', label: 'Syllabus' },
                  { id: 'notes', label: 'Notes' }
                ].map((type) => (
                  <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={activeType === type.id}
                      onChange={() => setActiveType(type.id)}
                      className="form-radio h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                    />
                    <span className="text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="p-4  mb-6">
          <div className="flex flex-wrap items-center justify-start gap-2">
            <span className="text-sm text-gray-500 font-medium">Active Filters:</span>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600">
                {activeYear === 'all' ? 'All Years' : activeYear}
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600">
                {activeType === 'all' ? 'All Types' : activeType.charAt(0).toUpperCase() + activeType.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-center bg-red-100 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Content Section */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center bg-red-100 p-3 rounded-lg mb-6">
              {error}
            </div>
          ) : filteredAcademics.length > 0 ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {filteredAcademics.map((academic) => (
                <div
                  key={academic._id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600 font-medium">
                        {academic.type.charAt(0).toUpperCase() + academic.type.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">{academic.year}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
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
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
                      >
                        <FaDownload />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {activeYear === 'all' 
                  ? 'Please select a year to view resources'
                  : `No ${activeType === 'all' ? 'resources' : activeType} available for ${activeYear}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Academic;
