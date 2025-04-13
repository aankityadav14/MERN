import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiUpload, FiEdit2, FiPlus, FiExternalLink, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiCheck, FiMapPin, FiCalendar, FiSearch, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { eventAPI, showDeleteConfirmation } from '../../api/privateapi';
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
          className={`relative rounded-2xl p-8 max-w-4xl w-full shadow-2xl ${
            isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          }`}
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

const EventForm = () => {
  const { isDarkMode } = useTheme();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    imageUrl: null, // Changed from media to imageUrl
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Add these utility functions at the top of your EventForm component, after the useState declarations
  const getGoogleDriveImage = (url) => {
    if (!url) return ""; // Return empty string if URL is undefined/null

    // Extract FILE_ID from Google Drive URL
    const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);

    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      const data = await eventAPI.getAllEvents();
      setEvents(data);
    } catch (error) {
      toast.error("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Existing handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageUrl: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventFormData = new FormData();
    eventFormData.append("title", formData.title);
    eventFormData.append("description", formData.description);
    eventFormData.append("date", formData.date);
    eventFormData.append("location", formData.location);
    if (formData.imageUrl && formData.imageUrl instanceof File) {
      eventFormData.append("image", formData.imageUrl);
    }

    try {
      if (editData?._id) {
        await eventAPI.updateEvent(editData._id, eventFormData);
        toast.success("Event updated successfully");
      } else {
        await eventAPI.createEvent(eventFormData);
        toast.success("Event created successfully");
      }

      setIsModalOpen(false);
      fetchEvents();
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        imageUrl: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
    }
  };

  const handleEdit = (event) => {
    setEditData(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      location: event.location || "",
      imageUrl: event.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (await showDeleteConfirmation('event')) {
      try {
        await eventAPI.deleteEvent(id);
        toast.success("Event deleted successfully");
        fetchEvents();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete event");
      }
    }
  };

  const handleCreateNew = () => {
    setEditData(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      imageUrl: null,
    });
    setIsModalOpen(true);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || new Date(event.date).toISOString().split('T')[0] === dateFilter;
    return matchesSearch && matchesDate;
  });

  return (
    <div className={`container mx-auto p-4 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Events Management
          </h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Manage your institution's events and activities
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiPlus className="text-xl" />
          Add New Event
        </motion.button>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Bar */}
          <div className="relative flex-1">
            <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${dateFilter ? 'ring-2 ring-blue-500' : ''}`}
            >
              <FiFilter className={dateFilter ? 'text-blue-500' : ''} />
              <span>{dateFilter ? 'Filtered by date' : 'Filter by date'}</span>
            </motion.button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute right-0 mt-2 p-4 rounded-xl shadow-lg z-10 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <label className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className={`px-4 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    {dateFilter && (
                      <button
                        onClick={() => {
                          setDateFilter('');
                          setIsFilterOpen(false);
                        }}
                        className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filter Status */}
        {(searchQuery || dateFilter) && (
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing results for:
            </span>
            {searchQuery && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                Search: {searchQuery}
              </span>
            )}
            {dateFilter && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                <FiCalendar className="mr-1" />
                Date: {new Date(dateFilter).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Events List */}
      <div className="grid gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setExpandedEvent(expandedEvent === event._id ? null : event._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={getGoogleDriveImage(event.imageUrl)}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMapPin className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(event);
                      }}
                    >
                      <FiEdit2 className="text-xl" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event._id);
                      }}
                    >
                      <FiTrash2 className="text-xl" />
                    </motion.button>
                    {expandedEvent === event._id ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedEvent === event._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t"
                  >
                    <div className="p-6 grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Event Details
                        </h3>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {event.description}
                        </p>
                      </div>
                      
                      {event.imageUrl && (
                        <div>
                          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            Event Image
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <img
                              src={getGoogleDriveImage(event.imageUrl)}
                              alt={event.title}
                              className="w-full h-auto rounded-lg"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                            <a 
                              href={event.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                              View Original
                              <FiExternalLink className="ml-2" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiSearch className="mx-auto text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className={`text-2xl font-bold mb-6 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {editData ? "Edit Event" : "Add New Event"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
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
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Event Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-xl hover:border-blue-500 transition-colors">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-400">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="sr-only"
                        required={!editData?._id}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={`px-6 py-3 rounded-xl transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {editData ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventForm;