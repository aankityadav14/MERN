import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiUpload,
  FiEdit2,
  FiPlus,
  FiImage,
  FiVideo,
  FiExternalLink,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiCheck,
  FiSearch,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import Masonry from 'react-masonry-css';
import { galleryAPI, showDeleteConfirmation } from '../../api/privateapi';
import Swal from 'sweetalert2';

// Modal Component with updated styling
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
            <FiX className="text-2xl" />
          </button>
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

const GalleryForm = () => {
  const { isDarkMode } = useTheme();
  const [galleryItems, setGalleryItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [galleryData, setGalleryData] = useState({
    title: "",
    type: "image",
    media: null,
  });

  // Add filter states
  const [filters, setFilters] = useState({
    title: '',
    type: 'all'
  });

  const formatMediaUrl = (url) => {
    if (!url) return "";
    const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const fetchGalleryItems = async () => {
    try {
      const data = await galleryAPI.getAllGalleryItems();
      setGalleryItems(data);
    } catch (error) {
      toast.error("Failed to fetch gallery items");
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleChange = (e) => {
    setGalleryData({ ...galleryData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setGalleryData({ ...galleryData, media: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", galleryData.title);
    formData.append("type", galleryData.type);
    if (galleryData.media) {
      formData.append("media", galleryData.media);
    }

    try {
      if (editData?._id) {
        await galleryAPI.updateGalleryItem(editData._id, formData);
        toast.success("Gallery item updated successfully");
      } else {
        await galleryAPI.createGalleryItem(formData);
        toast.success("Gallery item added successfully");
      }

      setGalleryData({ title: "", type: "image", media: null });
      setIsModalOpen(false);
      fetchGalleryItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setGalleryData({
      title: item.title || "",
      type: item.type || "image",
      media: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (await showDeleteConfirmation('gallery item')) {
      try {
        await galleryAPI.deleteGalleryItem(id);
        toast.success("Gallery item deleted successfully");
        fetchGalleryItems();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete item");
      }
    }
  };

  const handleCreateNew = () => {
    setEditData(null);
    setGalleryData({
      title: "",
      type: "image",
      media: null,
    });
    setIsModalOpen(true);
  };

  // Add these styles in your component or in a separate CSS file
  const masonryStyles = {
    display: "flex",
    marginLeft: "0px", /* gutter size offset */
    width: "auto"
  };

  const masonryColumnStyles = {
    paddingLeft: "30px", /* gutter size */
    backgroundClip: "padding-box"
  };

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  // Update the filtering logic before the return statement
  const filteredGalleryItems = galleryItems.filter(item => {
    const matchesTitle = item.title.toLowerCase().includes(filters.title.toLowerCase());
    const matchesType = filters.type === 'all' || item.type === filters.type;
    
    return matchesTitle && matchesType;
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
            Gallery Management
          </h1>
          <p
            className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Manage your institution's media gallery
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiPlus className="text-xl" />
          Add New Item
        </motion.button>
      </div>

      {/* Add Filter Section */}
      <div className={`mb-8 p-6 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Title Search */}
          <div className="relative">
            <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`} />
            <input
              type="text"
              placeholder="Search by title..."
              value={filters.title}
              onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.title || filters.type !== 'all') && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Active filters:
            </span>
            {filters.title && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
              }`}>
                Title: {filters.title}
                <FiX 
                  className="ml-2 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, title: '' }))}
                />
              </span>
            )}
            {filters.type !== 'all' && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
              }`}>
                Type: {filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}
                <FiX 
                  className="ml-2 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
                />
              </span>
            )}
            {/* Clear All Filters */}
            <button
              onClick={() => setFilters({ title: '', type: 'all' })}
              className="text-sm text-blue-500 hover:text-blue-600 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Masonry Gallery Grid */}
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid gap-2"
        columnClassName={masonryColumnStyles}
        style={masonryStyles}
      >
        {filteredGalleryItems.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-8 relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Media Preview */}
            <div className="relative">
              {item.type === "image" ? (
                <img
                  src={formatMediaUrl(item.mediaUrl)}
                  alt={item.title}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onLoad={(e) => {
                    const img = e.target;
                    img.style.height = `${(img.offsetWidth * img.naturalHeight) / img.naturalWidth}px`;
                  }}
                />
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <FiVideo className="text-4xl text-gray-400" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${item.type === "image" 
                      ? "bg-blue-500/20 text-blue-100" 
                      : "bg-purple-500/20 text-purple-100"
                    }`}
                  >
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                  <span className="text-gray-300 text-sm">
                    Added {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <FiEdit2 className="text-lg" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <FiTrash2 className="text-lg" />
                  </motion.button>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={formatMediaUrl(item.mediaUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors ml-auto"
                  >
                    <FiExternalLink className="text-lg" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Update empty state check to use filteredGalleryItems */}
        {filteredGalleryItems.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {filters.title || filters.type !== 'all' ? (
              <p>No gallery items match your filters</p>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNew}
                className={`mb-8 aspect-square rounded-2xl cursor-pointer border-2 border-dashed flex items-center justify-center ${
                  isDarkMode
                    ? "border-gray-700 hover:border-gray-600"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                <div className="text-center">
                  <FiPlus className={`text-4xl mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <p className={`font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Add New Item
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </Masonry>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2
          className={`text-2xl font-bold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {editData ? "Edit Gallery Item" : "Add New Gallery Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={galleryData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                name="type"
                value={galleryData.type}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors">
              <div className="space-y-1 text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept={
                        galleryData.type === "image" ? "image/*" : "video/*"
                      }
                      className="sr-only"
                      required={!editData?._id}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  {galleryData.type === "image"
                    ? "PNG, JPG, GIF up to 10MB"
                    : "MP4, WebM up to 50MB"}
                </p>
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
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2"
            >
              <FiCheck className="text-xl" />
              {editData ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GalleryForm;
