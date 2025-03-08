import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiUpload } from 'react-icons/fi';

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

const AcademicForm = () => {
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
      const response = await axios.get("http://localhost:5000/api/academic");
      setResources(response.data);
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
    const token = localStorage.getItem("token");

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
        await axios.put(
          `http://localhost:5000/api/academic/${editData._id}`,
          academicFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Academic resource updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/academic",
          academicFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/academic/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Academic Resources</h1>
        <button
          onClick={handleCreateNew}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Add New Resource
        </button>
      </div>

      {/* Resources List */}
      <div className="mt-6 space-y-4">
        {resources.map((resource) => (
          <div
            key={resource._id}
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedItem(expandedItem === resource._id ? null : resource._id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{resource.title}</span>
                <span className="text-sm text-gray-600">
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
              <div className="mt-4 border-t pt-4">
                <div className="grid gap-4">
                  {resource.mediaUrl && (
                    <div>
                      <h3 className="font-semibold mb-3">Document Preview</h3>
                      <div className="bg-white p-2 rounded border">
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
        ))}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">
          {editData ? "Edit Resource" : "Add New Resource"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="syllabus">Syllabus</option>
                <option value="notes">Notes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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