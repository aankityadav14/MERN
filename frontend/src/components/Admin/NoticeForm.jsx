import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiEdit2,
  FiPlus,
  FiCalendar,
  FiUser,
  FiFileText,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiCheck,
  FiUpload,
  FiSave,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { noticeAPI, showDeleteConfirmation } from "../../api/privateapi";
import Swal from "sweetalert2";

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
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>
        <motion.div
          className={`relative rounded-2xl p-8 max-w-4xl w-full shadow-2xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <button
            className={`absolute top-4 right-4 ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-400 hover:text-gray-500"
            }`}
            onClick={onClose}
          >
            <span className="text-2xl">&times;</span>
          </button>
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

const NoticeForm = ({ editData, onSubmitSuccess }) => {
  const { isDarkMode } = useTheme();
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    issuedBy: "",
    fileName: "",
    fileUrl: null,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [filters, setFilters] = useState({
    title: '',
    date: ''
  });

  // Fetch all notices
  const fetchNotices = async () => {
    try {
      const data = await noticeAPI.getAllNotices();
      console.log(data);
      setNotices(data);
    } catch (error) {
      toast.error("Failed to fetch notices");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        content: editData.content || "",
        category: editData.category || "",
        issuedBy: editData.issuedBy || "",
        file: null,
      });
      setPreview(editData.fileUrl || null);
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("issuedBy", formData.issuedBy);

      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      if (editData?._id) {
        await noticeAPI.updateNotice(editData._id, formDataToSend);
        toast.success("Notice updated successfully");
      } else {
        await noticeAPI.createNotice(formDataToSend);
        toast.success("Notice created successfully");
      }

      // Reset form and close modal
      setFormData({
        title: "",
        content: "",
        issuedBy: "",
        fileName: "",
        fileUrl: null,
      });
      setIsModalOpen(false);
      fetchNotices(); // Refresh the notices list
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Error submitting notice");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notice) => {
    setFormData({
      title: notice.title || "",
      content: notice.content || "",
      category: notice.category || "",
      issuedBy: notice.issuedBy || "",
      file: null,
    });
    setPreview(notice.fileUrl || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (await showDeleteConfirmation("notice")) {
      try {
        await noticeAPI.deleteNotice(id);
        toast.success("Notice deleted successfully");
        fetchNotices();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete notice");
      }
    }
  };

  const handleCreateNew = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      issuedBy: "",
      file: null,
    });
    setPreview(null);
    setIsModalOpen(true);
  };
  const formatMediaUrl = (url) => {
    const match = url.match(/[-\w]{25,}/);

    console.log(match);
    return match
      ? `https://lh3.googleusercontent.com/d/${match[0]}`
      : `https://google.com/drive/folders/uc?export=view&id=${match[0]}`;
  };

  const filteredNotices = notices.filter(notice => {
    const matchesTitle = !filters.title || 
      notice.title.toLowerCase().includes(filters.title.toLowerCase());
    const matchesDate = !filters.date || 
      new Date(notice.updatedAt).toLocaleDateString().includes(filters.date);
    
    return matchesTitle && matchesDate;
  });

  return (
    <div
      className={`container mx-auto p-4 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Notice Management
          </h1>
          <p
            className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Manage and publish official notices
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiPlus className="text-xl" />
          Add New Notice
        </motion.button>
      </div>

      <div className={`mb-6 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Title Filter */}
          <div>
            <input
              type="text"
              placeholder="Search by Title"
              value={filters.title}
              onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="text"
              placeholder="Search by Date (MM/DD/YYYY)"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.title || filters.date) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Active filters:
            </span>
            {filters.title && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                Title: {filters.title}
                <FiX 
                  className="ml-2 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, title: '' }))}
                />
              </span>
            )}
            {filters.date && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                Date: {filters.date}
                <FiX 
                  className="ml-2 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, date: '' }))}
                />
              </span>
            )}
            <button
              onClick={() => setFilters({ title: '', date: '' })}
              className="text-sm text-blue-500 hover:text-blue-600 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Notices List */}
      <div className="grid gap-6">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <motion.div
              key={notice._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() =>
                  setExpandedNotice(
                    expandedNotice === notice._id ? null : notice._id
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <h3
                      className={`text-xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {notice.title}
                    </h3>
                    <div
                      className={`flex items-center gap-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-blue-600" />
                        {new Date(notice.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUser className="text-blue-600" />
                        {notice.issuedBy}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 text-blue-600 rounded-lg transition-colors ${
                        isDarkMode ? "hover:bg-blue-900/20" : "hover:bg-blue-50"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(notice);
                      }}
                    >
                      <FiEdit2 className="text-xl" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 text-red-600 rounded-lg transition-colors ${
                        isDarkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notice._id);
                      }}
                    >
                      <FiTrash2 className="text-xl" />
                    </motion.button>
                    {expandedNotice === notice._id ? (
                      <FiChevronUp
                        className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                      />
                    ) : (
                      <FiChevronDown
                        className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedNotice === notice._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`border-t ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="p-6 grid md:grid-cols-2 gap-8">
                      <div>
                        <h3
                          className={`text-lg font-semibold mb-4 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Content
                        </h3>
                        <p
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          {notice.content}
                        </p>
                      </div>
                      <div>
                        <img
                          src={formatMediaUrl(notice.fileUrl)}
                          alt=""
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-64 object-cover object-center"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {filters.title || filters.date
              ? 'No notices match your filters'
              : 'No notices available'}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2
          className={`text-2xl font-bold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {editData ? "Edit Notice" : "Add New Notice"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter notice title"
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter notice content"
                // rows="4"
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            {/* Issued By */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Issued By
              </label>
              <input
                type="text"
                name="issuedBy"
                value={formData.issuedBy}
                onChange={handleInputChange}
                placeholder="Enter issuer name"
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Attachment
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FiUpload />
                  Upload File
                </label>
                {formData.fileName && (
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    {formData.fileName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={`px-6 py-3 rounded-xl transition-colors ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiSave className="text-xl" />
                  {editData ? "Update Notice" : "Save Notice"}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticeForm;
