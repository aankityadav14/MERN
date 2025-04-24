import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiUserPlus, FiUpload, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { mentorMenteeAPI, showDeleteConfirmation } from '../../api/privateapi';
import Swal from 'sweetalert2';

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  const { isDarkMode } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className={`relative rounded-2xl p-8 max-w-4xl w-full shadow-2xl ${
          isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
        }`}>
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <span className="text-2xl">&times;</span>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const MentorMenteeForm = () => {
  const { isDarkMode } = useTheme();
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [formData, setFormData] = useState({
    mentorName: "",
    department: "",
    semester: "Semester 1",
    academicYear: "",
    mentees: [{ name: "", rollNo: "" }],
    media: null
  });

  // Add filter states
  const [filters, setFilters] = useState({
    mentorName: '',
    semester: ''
  });

  // Add these functions at the top of your MentorMenteeForm component
  const getGoogleDriveFileId = (url) => {
    if (url?.includes("drive.google.com")) {
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

  // Fetch all records
  const fetchRecords = async () => {
    try {
      const data = await mentorMenteeAPI.getAllRecords();
      setRecords(data);
    } catch (error) {
      toast.error("Failed to fetch records");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, media: e.target.files[0] });
  };

  const handleMenteeChange = (index, field, value) => {
    const updatedMentees = [...formData.mentees];
    updatedMentees[index][field] = value;
    setFormData({ ...formData, mentees: updatedMentees });
  };

  const addMentee = () => {
    setFormData({
      ...formData,
      mentees: [...formData.mentees, { name: "", rollNo: "" }]
    });
  };

  const removeMentee = (index) => {
    const updatedMentees = formData.mentees.filter((_, i) => i !== index);
    setFormData({ ...formData, mentees: updatedMentees });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mentorMenteeFormData = new FormData();
    mentorMenteeFormData.append("mentorName", formData.mentorName);
    mentorMenteeFormData.append("department", formData.department);
    mentorMenteeFormData.append("semester", formData.semester);
    mentorMenteeFormData.append("academicYear", formData.academicYear);
    mentorMenteeFormData.append("mentees", JSON.stringify(formData.mentees));
    if (formData.media) {
      mentorMenteeFormData.append("media", formData.media);
    }

    try {
      if (editData?._id) {
        await mentorMenteeAPI.updateRecord(editData._id, mentorMenteeFormData);
        toast.success("Mentor-Mentee record updated successfully");
      } else {
        await mentorMenteeAPI.createRecord(mentorMenteeFormData);
        toast.success("Mentor-Mentee record created successfully");
      }

      setFormData({
        mentorName: "",
        department: "",
        semester: "Semester 1",
        academicYear: "",
        mentees: [{ name: "", rollNo: "" }],
        media: null
      });
      setIsModalOpen(false);
      fetchRecords();

    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
      console.error("Error:", error);
    }
  };

  const handleEdit = (record) => {
    setEditData(record);
    setFormData({
      mentorName: record.mentorName || "",
      department: record.department || "",
      semester: record.semester || "",
      academicYear: record.academicYear || "",
      mentees: record.mentees || [{ name: "", rollNo: "" }],
      media: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (await showDeleteConfirmation('mentor-mentee record')) {
        try {
            await mentorMenteeAPI.deleteRecord(id);
            toast.success("Record deleted successfully");
            fetchRecords();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete record");
        }
    }
  };

  const handleCreateNew = () => {
    setEditData(null);
    setFormData({
      mentorName: "",
      department: "",
      semester: "Semester 1",
      academicYear: "",
      mentees: [{ name: "", rollNo: "" }],
      media: null
    });
    setIsModalOpen(true);
  };

  // Add filtered records logic
  const filteredRecords = records.filter(record => {
    const matchesMentor = !filters.mentorName || 
      record.mentorName.toLowerCase().includes(filters.mentorName.toLowerCase());
    const matchesSemester = !filters.semester || record.semester === filters.semester;
    
    return matchesMentor && matchesSemester;
  });

  return (
    <div className={`container mx-auto p-4 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Mentor-Mentee Management
        </h1>
        <button
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiUserPlus className="text-xl" />
          Create New Record
        </button>
      </div>

      {/* Add Filter Section */}
      <div className={`mb-6 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Mentor Name Filter */}
          <div>
            <input
              type="text"
              placeholder="Search by Mentor Name"
              value={filters.mentorName}
              onChange={(e) => setFilters(prev => ({ ...prev, mentorName: e.target.value }))}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Semester Filter */}
          <div>
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
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.mentorName || filters.semester) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Active filters:
            </span>
            {filters.mentorName && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                Mentor: {filters.mentorName}
                <FiTrash2 
                  className="ml-2 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, mentorName: '' }))}
                />
              </span>
            )}
            {filters.semester && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                Semester: {filters.semester}
                <FiTrash2 
                  className="ml-2 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, semester: '' }))}
                />
              </span>
            )}
            {/* Clear All Filters */}
            <button
              onClick={() => setFilters({ mentorName: '', semester: '' })}
              className="text-sm text-purple-500 hover:text-purple-600 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Update Records List to use filteredRecords */}
      <div className="mt-6 space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              key={record._id}
              className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setExpandedRecord(expandedRecord === record._id ? null : record._id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {record.mentorName}
                    </span>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {record.department} - {record.semester} ({record.academicYear})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="p-2 text-blue-400 hover:bg-blue-700 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(record);
                      }}
                    >
                      <FiEdit2 className="text-xl" />
                    </button>
                    <button
                      className="p-2 text-red-400 hover:bg-red-700 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(record._id);
                      }}
                    >
                      <FiTrash2 className="text-xl" />
                    </button>
                    {expandedRecord === record._id ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
                  </div>
                </div>
              </div>

              {expandedRecord === record._id && (
                <div className={`mt-4 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                } pt-4 px-6 pb-6`}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        Mentees List
                      </h3>
                      <div className="space-y-3">
                        {record.mentees.map((mentee, index) => (
                          <div key={index} className={`p-3 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {mentee.name}
                            </span>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {' - '}{mentee.rollNo}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      {record.mediaUrl && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Attached Document</h3>
                          <div className="bg-gray-700 p-4 rounded-xl">
                            {record.mediaUrl.toLowerCase().endsWith('.pdf') || 
                           getGoogleDriveFileId(record.mediaUrl) ? (
                            <div className="bg-white p-2 rounded border">
                              <iframe
                                src={getGoogleDriveFileId(record.mediaUrl) 
                                  ? `https://drive.google.com/file/d/${getGoogleDriveFileId(record.mediaUrl)}/preview`
                                  : `http://localhost:5000/${record.mediaUrl}`}
                                width="100%"
                                height="300px"
                                className="rounded"
                                title="Document Preview"
                                sandbox="allow-scripts allow-same-origin"
                              ></iframe>
                              <a
                                href={getGoogleDriveFileId(record.mediaUrl)
                                  ? `https://drive.google.com/file/d/${getGoogleDriveFileId(record.mediaUrl)}/view`
                                  : `http://localhost:5000/${record.mediaUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center text-blue-400 hover:text-blue-300"
                              >
                                Open Document
                                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5z" />
                                </svg>
                              </a>
                            </div>
                          ) : (
                            <div className="bg-white p-2 rounded border">
                              <img
                                src={formatMediaUrl(record.mediaUrl) || `http://localhost:5000/${record.mediaUrl}`}
                                alt="Attached media"
                                className="max-w-full h-auto rounded"
                              />
                            </div>
                          )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {filters.mentorName || filters.semester ? (
              <p>No records match your filters</p>
            ) : (
              <p>No mentor-mentee records available</p>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className={`text-2xl font-bold mb-6 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {editData ? "Edit Record" : "Create New Record"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mentor Name
              </label>
              <input
                type="text"
                name="mentorName"
                value={formData.mentorName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={`Semester ${num}`}>
                    Semester {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="e.g., 2023-24"
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Mentees List
              </label>
              <button
                type="button"
                onClick={addMentee}
                className="flex items-center text-purple-600 hover:text-purple-700"
              >
                <FiUserPlus className="mr-1" /> Add Mentee
              </button>
            </div>

            {formData.mentees.map((mentee, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Student Name"
                  value={mentee.name}
                  onChange={(e) => handleMenteeChange(index, "name", e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
                <input
                  type="text"
                  placeholder="Roll Number"
                  value={mentee.rollNo}
                  onChange={(e) => handleMenteeChange(index, "rollNo", e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
                {formData.mentees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMentee(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Document
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,image/*"
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required={!editData?._id}
            />
            <p className="mt-1 text-sm text-gray-500">
              Accepted formats: PDF files and Images
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center"
          >
            <FiUpload className="mr-2" />
            {editData?._id ? "Update Record" : "Create Record"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MentorMenteeForm;