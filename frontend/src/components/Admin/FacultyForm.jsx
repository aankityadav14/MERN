import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUpload, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg p-8 max-w-4xl w-full">
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

const FacultyForm = () => {
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    email: '',
    phone: '', // Add phone field
    media: null
  });

  const formatMediaUrl = (url) => {
    if (!url) return ""; // Return empty string if URL is undefined/null

    // Extract FILE_ID from Google Drive URL
    const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  // Fetch all faculty records
  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/faculty");
      setRecords(response.data);
    } catch (error) {
      toast.error("Failed to fetch faculty records");
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

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    const facultyFormData = new FormData();
    facultyFormData.append('name', formData.name);
    facultyFormData.append('designation', formData.designation);
    facultyFormData.append('department', formData.department);
    facultyFormData.append('email', formData.email);
    facultyFormData.append('phone', formData.phone); // Add phone field
    if (formData.media) {
      facultyFormData.append('image', formData.media); // Changed from 'media' to 'image'
    }

    const token = localStorage.getItem('token');

    try {
      if (editData?._id) {
        await axios.put(
          `http://localhost:5000/api/faculty/${editData._id}`,
          facultyFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success('Faculty updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/faculty',
          facultyFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success('Faculty created successfully');
      }

      setFormData({
        name: '',
        designation: '',
        department: '',
        email: '',
        phone: '', // Add phone field
        media: null
      });
      setIsModalOpen(false);
      fetchRecords();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing request');
      console.error('Error:', error);
    }
  };

  const handleEdit = (record) => {
    setEditData(record);
    setFormData({
      name: record.name || '',
      designation: record.designation || '',
      department: record.department || '',
      email: record.email || '',
      phone: record.phone || '', // Add phone field
      media: null
    });
    setIsModalOpen(true);
  };

  // Update the handleDelete function
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/faculty/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Faculty deleted successfully');
        fetchRecords();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete faculty');
        console.error('Error:', error);
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
      phone: '', // Add phone field
      media: null
    });
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Faculty Management</h1>
        <button
          onClick={handleCreateNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Faculty
        </button>
      </div>

      {/* Faculty List */}
      <div className="mt-6 space-y-4">
        {records.map((record) => (
          <div
            key={record._id}
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedRecord(expandedRecord === record._id ? null : record._id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{record.name}</span>
                <span className="text-sm text-gray-600">
                  {record.designation} - {record.department}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(record);
                  }}
                >
                  <FiEdit2 className="inline mr-1" /> Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(record._id);
                  }}
                >
                  <FiTrash2 className="inline mr-1" /> Delete
                </button>
                {expandedRecord === record._id ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedRecord === record._id && (
              <div className="mt-4 border-t pt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <p className="text-sm">Email: {record.email}</p>
                    {record.phone && <p className="text-sm">Phone: {record.phone}</p>}
                  </div>
                  
                  {/* Profile Image Preview */}
                  {record.mediaUrl || record.imageUrl ? (
                    <div>
                      <h3 className="font-semibold mb-3">Profile Image</h3>
                      <div className="bg-white p-2 rounded border">
                        <img
                          src={formatMediaUrl(record.mediaUrl || record.imageUrl)}
                          alt={`${record.name}'s profile`}
                          className="w-full h-auto object-contain rounded"
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
                          className="mt-2 text-blue-600 hover:underline flex items-center justify-center"
                        >
                          View Original
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">
          {editData ? "Edit Faculty" : "Add New Faculty"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Existing form fields go here */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
                pattern="[0-9]{10}"
                placeholder="Enter 10-digit phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full"
              required={!editData?._id}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiUpload className="mr-2" />
            {editData?._id ? 'Update Faculty' : 'Add Faculty'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyForm;
