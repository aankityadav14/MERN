import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiUpload } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { alumniAPI, showDeleteConfirmation } from '../../api/privateapi';

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

const Aluminia = () => {
  const { isDarkMode } = useTheme();
  const [alumni, setAlumni] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedAlumni, setExpandedAlumni] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    graduationYear: "",
    department: "",
    email: "",
    phone: "",
    linkedin: "",
    image: null,
    currentPosition: "",
    company: ""
  });

  const getGoogleDriveImage = (url) => {
    if (!url) return "";
    const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const fetchAlumni = async () => {
    try {
      const data = await alumniAPI.getAllAlumni();
      setAlumni(data);
    } catch (error) {
      toast.error("Failed to fetch alumni");
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const alumniFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'image' && formData[key]) {
        alumniFormData.append('image', formData[key]);
      } else if (formData[key]) {
        alumniFormData.append(key, formData[key]);
      }
    });

    try {
      if (editData?._id) {
        await alumniAPI.updateAlumni(editData._id, alumniFormData);
        toast.success("Alumni updated successfully");
      } else {
        await alumniAPI.createAlumni(alumniFormData);
        toast.success("Alumni added successfully");
      }
      
      setFormData({
        name: "",
        graduationYear: "",
        department: "",
        email: "",
        phone: "",
        linkedin: "",
        image: null,
        currentPosition: "",
        company: ""
      });
      setIsModalOpen(false);
      fetchAlumni();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
    }
  };

  const handleEdit = (record) => {
    setEditData(record);
    setFormData({
      name: record.name || "",
      graduationYear: record.graduationYear || "",
      department: record.department || "",
      email: record.email || "",
      phone: record.phone || "",
      linkedin: record.linkedin || "",
      image: null,
      currentPosition: record.currentPosition || "",
      company: record.company || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (await showDeleteConfirmation('alumni record')) {
      try {
        await alumniAPI.deleteAlumni(id);
        toast.success("Alumni deleted successfully");
        fetchAlumni();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete alumni");
      }
    }
  };

  const handleCreateNew = () => {
    setEditData(null);
    setFormData({
      name: "",
      graduationYear: "",
      department: "",
      email: "",
      phone: "",
      linkedin: "",
      image: null,
      currentPosition: "",
      company: ""
    });
    setIsModalOpen(true);
  };

  return (
    <div className={`container mx-auto p-4 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Alumni Management
        </h1>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Alumni
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {alumni.map((alum) => (
          <div
            key={alum._id}
            className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div 
              className="p-6 cursor-pointer"
              onClick={() => setExpandedAlumni(expandedAlumni === alum._id ? null : alum._id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {alum.name}
                  </span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {alum.graduationYear} - {alum.department}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 text-blue-400 hover:bg-blue-700 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(alum);
                    }}
                  >
                    <FiEdit2 className="text-xl" />
                  </button>
                  <button
                    className="p-2 text-red-400 hover:bg-red-700 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(alum._id);
                    }}
                  >
                    <FiTrash2 className="text-xl" />
                  </button>
                  {expandedAlumni === alum._id ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
                </div>
              </div>
            </div>

            {expandedAlumni === alum._id && (
              <div className={`mt-4 border-t pt-4 px-6 pb-6 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>Contact Information</h3>
                    <div className={`space-y-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p><strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Email:</strong> {alum.email}</p>
                      <p><strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Phone:</strong> {alum.phone}</p>
                      {alum.linkedin && (
                        <p>
                          <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>LinkedIn:</strong>{" "}
                          <a
                            href={alum.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Profile
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                  {alum.imageUrl && (
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>Profile Image</h3>
                      <div className="bg-gray-700 p-4 rounded-xl">
                        <img
                          src={getGoogleDriveImage(alum.imageUrl)}
                          alt={alum.name}
                          className="w-full h-auto object-contain rounded"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className={`text-2xl font-bold mb-4 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {editData ? "Edit Alumni" : "Add New Alumni"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Graduation Year*</label>
              <input
                type="text"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="YYYY"
                pattern="\d{4}"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Department*</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Current Position</label>
              <input
                type="text"
                name="currentPosition"
                value={formData.currentPosition}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Phone*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                pattern="[0-9]{10}"
                placeholder="10-digit phone number"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>LinkedIn Profile*</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="https://linkedin.com/in/username"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Profile Image*</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-1 block w-full"
                required={!editData?._id}
              />
              <p className="mt-1 text-sm text-gray-500">Required for new entries</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          >
            <FiUpload className="mr-2" />
            {editData ? "Update Alumni" : "Add Alumni"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Aluminia;