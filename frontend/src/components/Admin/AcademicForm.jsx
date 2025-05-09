import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiUpload } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { academicAPI, showDeleteConfirmation } from '../../api/privateapi';
import Swal from 'sweetalert2';

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  const { isDarkMode } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75" onClick={onClose}></div>
        <div className={`relative rounded-2xl p-8 max-w-4xl w-full shadow-2xl ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
          <button
            className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`}
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

const AcademicForm = () => {
  const { isDarkMode } = useTheme();
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    type: "syllabus",
    year: "First Year",
    semester: "Semester 1",
    file: null,
  });

  // Add filter states
  const [filters, setFilters] = useState({
    year: '',
    semester: '',
    type: ''
  });

  const getGoogleDriveFileId = (url) => {
    if (!url) return null;
    if (url.includes("drive.google.com")) {
      return url.match(/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
    }
    return null;
  };

  const formatMediaUrl = (url) => {
    if (!url) return "";
    const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  const fetchResources = async () => {
    try {
      const data = await academicAPI.getAllResources();
      setResources(data);
    } catch (error) {
      toast.error("Failed to fetch academic resources");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const academicFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'file' && formData[key]) {
        academicFormData.append('file', formData[key]);
      } else {
        academicFormData.append(key, formData[key]);
      }
    });

    try {
      if (editData?._id) {
        await academicAPI.updateResource(editData._id, academicFormData);
        toast.success("Academic resource updated successfully");
      } else {
        await academicAPI.createResource(academicFormData);
        toast.success("Academic resource added successfully");
      }

      setFormData({
        title: "",
        subject: "",
        type: "syllabus",
        year: "First Year",
        semester: "Semester 1",
        file: null,
      });
      setIsModalOpen(false);
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
    }
  };

  const handleEdit = (resource) => {
    setEditData(resource);
    setFormData({
      title: resource.title || "",
      subject: resource.subject || "",
      type: resource.type || "syllabus",
      year: resource.year || "First Year",
      semester: resource.semester || "Semester 1",
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (await showDeleteConfirmation('academic resource')) {
      try {
        await academicAPI.deleteResource(id);
        toast.success("Resource deleted successfully");
        fetchResources();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete resource");
      }
    }
  };

  const handleCreateNew = () => {
    setEditData(null);
    setFormData({
      title: "",
      subject: "",
      type: "syllabus",
      year: "First Year",
      semester: "Semester 1",
      file: null,
    });
    setIsModalOpen(true);
  };

  // Add filtered resources logic
  const filteredResources = resources.filter(resource => {
    const matchesYear = !filters.year || resource.year === filters.year;
    const matchesSemester = !filters.semester || resource.semester === filters.semester;
    const matchesType = !filters.type || resource.type === filters.type;
    
    return matchesYear && matchesSemester && matchesType;
  });

  return (
    <div className={`container mx-auto p-4 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Academic Resources
        </h1>
        <button
          onClick={handleCreateNew}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Add New Resource
        </button>
      </div>

      {/* Add Filter Section */}
      <div className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
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
                <FiTrash2 
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
                <FiTrash2 
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
                <FiTrash2 
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

      {/* Update Resources List to use filteredResources */}
      <div className="mt-6 space-y-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div
              key={resource._id}
              className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div 
                className="flex justify-between items-center cursor-pointer p-6"
                onClick={() => setExpandedItem(expandedItem === resource._id ? null : resource._id)}
              >
                <div className="flex flex-col">
                  <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {resource.title}
                  </span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-700'}>
                    {resource.subject} - {resource.year} ({resource.semester})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(resource);
                    }}
                  >
                    <FiEdit2 className="inline mr-1" /> Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(resource._id);
                    }}
                  >
                    <FiTrash2 className="inline mr-1" /> Delete
                  </button>
                  {expandedItem === resource._id ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedItem === resource._id && (
                <div className={`mt-4 border-t pt-4 px-6 pb-6 ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="grid gap-4">
                    {resource.mediaUrl && (
                      <div>
                        <h3 className={`font-semibold mb-3 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>Document Preview</h3>
                        <div className="bg-gray-700 p-2 rounded">
                          <div className="aspect-w-16 aspect-h-9">
                            <iframe
                              src={formatMediaUrl(resource.mediaUrl)}
                              className="w-full h-[600px] rounded-lg"
                              frameBorder="0"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                          <div className="mt-4 text-center">
                            <a
                              href={resource.mediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center justify-center"
                            >
                              <FiUpload className="mr-2" />
                              View Original
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {filters.year || filters.semester || filters.type ? (
              <p>No resources match your filters</p>
            ) : (
              <p>No academic resources available</p>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className={`text-2xl font-bold mb-4 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {editData ? "Edit Resource" : "Add New Resource"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="syllabus">Syllabus</option>
                <option value="notes">Notes</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="MSc Part 1">MSc Part 1</option>
                <option value="MSc Part 2">MSc Part 2</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="semester 5">Semester 5</option>
                <option value="semester 6">Semester 6</option>
                <option value="part 1">Part 1</option>
                <option value="part 2">Part 2</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>Upload File</label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
              <p className="mt-1 text-sm text-gray-500">Only PDF and DOC/DOCX files are allowed</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center"
          >
            <FiUpload className="mr-2" />
            {editData ? "Update Resource" : "Upload Resource"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AcademicForm;