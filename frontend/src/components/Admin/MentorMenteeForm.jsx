import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiUserPlus, FiUpload, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

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

const MentorMenteeForm = () => {
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
      const response = await axios.get("http://localhost:5000/api/mentor-mentee");
      setRecords(response.data);
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
        await axios.put(
          `http://localhost:5000/api/mentor-mentee/${editData._id}`,
          mentorMenteeFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        toast.success("Mentor-Mentee record updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/mentor-mentee",
          mentorMenteeFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
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

      if (onSubmitSuccess) onSubmitSuccess();

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
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/mentor-mentee/${id}`);
        toast.success("Record deleted successfully");
        fetchRecords();
      } catch (error) {
        toast.error("Failed to delete record");
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mentor-Mentee Management</h1>
        <button
          onClick={handleCreateNew}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Create New Record
        </button>
      </div>

      {/* Records List */}
      <div className="mt-6 space-y-4">
        {records.map((record) => (
          <div
            key={record._id}
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            {/* Header Section */}
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedRecord(expandedRecord === record._id ? null : record._id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{record.mentorName}</span>
                <span className="text-sm text-gray-600">
                  {record.department} - {record.semester} ({record.academicYear})
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
                  {/* Mentees List */}
                  <div>
                    <h3 className="font-semibold mb-3">Mentees List</h3>
                    <div className="space-y-2">
                      {record.mentees.map((mentee, index) => (
                        <div key={index} className="text-sm bg-white p-2 rounded border">
                          <span className="font-medium">{mentee.name}</span> - {mentee.rollNo}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Document Preview */}
                  <div>
                    {record.mediaUrl && (
                      <div>
                        <h3 className="font-semibold mb-3">Attached Document</h3>
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
                              className="mt-2 text-blue-600 hover:underline flex items-center justify-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                              Open Document
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
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">
          {editData ? "Edit Mentor-Mentee Record" : "Create New Mentor-Mentee Record"}
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
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Roll Number"
                  value={mentee.rollNo}
                  onChange={(e) => handleMenteeChange(index, "rollNo", e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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