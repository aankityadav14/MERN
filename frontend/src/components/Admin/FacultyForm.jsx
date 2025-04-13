import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUpload, FiEdit2, FiPlus, FiMail, FiPhone, FiExternalLink, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { facultyAPI, showDeleteConfirmation } from '../../api/privateapi';
import Swal from 'sweetalert2';

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  const { isDarkMode } = useTheme();
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`relative rounded-2xl p-8 max-w-4xl w-full shadow-2xl ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
            onClick={onClose}
          >
            <FiX className="text-2xl" />
          </button>
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

const FacultyForm = () => {
  const { isDarkMode } = useTheme();
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    email: '',
    phone: '',
    media: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const formatMediaUrl = (url) => {
    if (!url) return "";
    const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

 const fetchRecords = async () => {
     try {
        const data = await facultyAPI.getAllFaculty();
        setRecords(data);
    } catch (error) {
        console.error('Error fetching faculty:', error);
        toast.error(error.response?.data?.message || "Failed to fetch faculty records");
    }
   };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, media: file });
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
  
      const facultyFormData = new FormData();
      facultyFormData.append('name', formData.name);
      facultyFormData.append('designation', formData.designation);
      facultyFormData.append('department', formData.department);
      facultyFormData.append('email', formData.email);
      facultyFormData.append('phone', formData.phone);
      if (formData.media) {
        facultyFormData.append('image', formData.media);
      }
  
      try {
        if (editData?._id) {
            await facultyAPI.updateFaculty(editData._id, facultyFormData);
            toast.success('Faculty updated successfully');
        } else {
            await facultyAPI.createFaculty(facultyFormData);
            toast.success('Faculty created successfully');
        }
  
        setFormData({
          name: '',
          designation: '',
          department: '',
          email: '',
          phone: '',
          media: null
        });
        setIsModalOpen(false);
        fetchRecords();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error processing request');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
  

  const handleEdit = (record) => {
    setEditData(record);
    setFormData({
      name: record.name || '',
      designation: record.designation || '',
      department: record.department || '',
      email: record.email || '',
      phone: record.phone || '',
      media: null
    });
    setPreviewUrl(record.mediaUrl || record.imageUrl ? formatMediaUrl(record.mediaUrl || record.imageUrl) : null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (await showDeleteConfirmation('faculty member')) {
        try {
            await facultyAPI.deleteFaculty(id);
            toast.success("Faculty deleted successfully");
            fetchRecords();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete faculty");
        }
    }
  };

  const handleCreateNew = () => {
    setEditData(null);
    setFormData({
      name: '',
      designation: '',
      department: '',
      email: '',
      phone: '',
      media: null
    });
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  return (
    <div className={`container mx-auto p-4 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Faculty Management
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiPlus className="text-xl" />
          Add New Faculty
        </motion.button>
      </div>

      {/* Faculty List */}
      <div className="grid gap-6">
        {records.map((record) => (
          <motion.div
            key={record._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div 
              className="p-6 cursor-pointer"
              onClick={() => setExpandedRecord(expandedRecord === record._id ? null : record._id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700">
                    <img
                      src={formatMediaUrl(record.mediaUrl || record.imageUrl)}
                      alt={record.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>{record.name}</h3>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {record.designation} - {record.department}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-400 hover:bg-blue-700 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(record);
                    }}
                  >
                    <FiEdit2 className="text-xl" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-red-400 hover:bg-red-700 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(record._id);
                    }}
                  >
                    <FiTrash2 className="text-xl" />
                  </motion.button>
                  {expandedRecord === record._id ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedRecord === record._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="p-6 grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>Contact Information</h3>
                      <div className="space-y-3">
                        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          <FiMail className="text-blue-400" />
                          {record.email}
                        </div>
                        {record.phone && (
                          <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            <FiPhone className="text-blue-400" />
                            {record.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {record.mediaUrl || record.imageUrl ? (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Profile Image</h3>
                        <div className="bg-gray-700 p-4 rounded-xl">
                          <img
                            src={formatMediaUrl(record.mediaUrl || record.imageUrl)}
                            alt={`${record.name}'s profile`}
                            className="w-full h-auto rounded-lg"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                          <a 
                            href={record.mediaUrl || record.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center text-blue-400 hover:text-blue-500 font-medium"
                          >
                            View Original
                            <FiExternalLink className="ml-2" />
                          </a>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-6">
          {editData ? "Edit Faculty" : "Add New Faculty"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-100 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-100 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-100 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-100 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-100 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                required
                pattern="[0-9]{10}"
                placeholder="Enter 10-digit phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Profile Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-xl hover:border-blue-500 transition-colors">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFormData({ ...formData, media: null });
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FiX className="text-sm" />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                          required={!editData?._id}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiCheck className="text-xl" />
                  {editData?._id ? 'Update Faculty' : 'Add Faculty'}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyForm;
