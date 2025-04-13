import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUpload, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiCheck, FiPlus } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { achievementAPI, showDeleteConfirmation } from '../../api/privateapi';
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
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>
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

const AchievementForm = () => {
  const { isDarkMode } = useTheme();
  const [achievements, setAchievements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    achievementTitle: '',
    description: '',
    category: 'Academic',
    year: new Date().getFullYear(),
    image: null,
    proof: null
  });
  const [previewUrls, setPreviewUrls] = useState({ image: null, proof: null });

  const categories = ['Academic', 'Competition', 'Hackathon', 'Internship', 'Placement', 'Other'];

  const fetchAchievements = async () => {
    try {
      const data = await achievementAPI.getAllAchievements();
      setAchievements(data);
    } catch (error) {
      toast.error('Failed to fetch achievements');
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const achievementFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        achievementFormData.append(key, formData[key]);
      }
    });

    try {
      if (editData?._id) {
        await achievementAPI.updateAchievement(editData._id, achievementFormData);
        toast.success('Achievement updated successfully');
      } else {
        await achievementAPI.createAchievement(achievementFormData);
        toast.success('Achievement added successfully');
      }

      setFormData({
        studentName: '',
        achievementTitle: '',
        description: '',
        category: 'Academic',
        year: new Date().getFullYear(),
        image: null,
        proof: null
      });
      setPreviewUrls({ image: null, proof: null });
      setIsModalOpen(false);
      fetchAchievements();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing request');
    } finally {
      setIsLoading(false);
    }
  };

  const formatMediaUrl = (url) => {
    if (!url) return "";
    const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    if (match) {
      const fileId = match[1];
      return {
        image: `https://lh3.googleusercontent.com/d/${fileId}`,
        preview: `https://drive.google.com/file/d/${fileId}/preview`
      };
    }
    return { image: url, preview: url };
  };

  const handleDelete = async (id) => {
    if (await showDeleteConfirmation('achievement')) {
      try {
        await achievementAPI.deleteAchievement(id);
        toast.success("Achievement deleted successfully");
        fetchAchievements();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete achievement");
      }
    }
  };

  return (
    <div className={`container mx-auto p-4 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Student Achievements
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditData(null);
            setFormData({
              studentName: '',
              achievementTitle: '',
              description: '',
              category: 'Academic',
              year: new Date().getFullYear(),
              image: null,
              proof: null
            });
            setPreviewUrls({ image: null, proof: null });
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiPlus className="text-xl" />
          Add Achievement
        </motion.button>
      </div>

      {/* Achievements List */}
      <div className="grid gap-6">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  {console.log(achievement , formatMediaUrl(achievement.imageUrl))}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700">
                    <img
                      src={formatMediaUrl(achievement.imageUrl).image}
                      alt={achievement.studentName}
                      className="w-full h-full object-cover"
                     
                    referrerPolicy='no-referrer'
                    />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>{achievement.achievementTitle}</h3>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {achievement.studentName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-400 hover:bg-blue-700 rounded-lg transition-colors"
                    onClick={() => {
                      setEditData(achievement);
                      setFormData({
                        ...achievement,
                        image: null,
                        proof: null,
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    <FiEdit2 className="text-xl" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-red-400 hover:bg-red-700 rounded-lg transition-colors"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleDelete(achievement._id);
                    }}
                  >
                    <FiTrash2 className="text-xl" />
                  </motion.button>
                  <button onClick={() => setExpandedItem(expandedItem === achievement._id ? null : achievement._id)}>
                    {expandedItem === achievement._id ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedItem === achievement._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`mt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}
                  >
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{achievement.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {achievement.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {achievement.year}
                      </span>
                    </div>

                    {/* Add Proof Document Preview */}
                    {achievement.proofUrl && (
                      <div className="mt-4">
                        <h3 className={`font-semibold mb-3 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>Proof Document</h3>
                        <div className="bg-gray-700 p-2 rounded">
                          <div className="aspect-w-16 aspect-h-9">
                            <iframe
                              src={formatMediaUrl(achievement.proofUrl).preview}
                              className="w-full h-[600px] rounded-lg"
                              frameBorder="0"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                          <div className="mt-4 text-center">
                            <a
                              href={achievement.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center justify-center"
                            >
                              <FiUpload className="mr-2" />
                              View Original Document
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">
            {editData ? 'Edit Achievement' : 'Add New Achievement'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Student Name</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Achievement Title</label>
              <input
                type="text"
                name="achievementTitle"
                value={formData.achievementTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full"
              />
              {previewUrls.image && (
                <img src={previewUrls.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Proof Document</label>
              <input
                type="file"
                name="proof"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 rounded-lg border hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : editData ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AchievementForm;
