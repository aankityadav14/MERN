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

const Aluminia = () => {
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
      const response = await axios.get("http://localhost:5000/api/alumni");
      setAlumni(response.data);
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
    const token = localStorage.getItem("token");

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
        await axios.put(
          `http://localhost:5000/api/alumni/${editData._id}`,
          alumniFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Alumni updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/alumni",
          alumniFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
    if (window.confirm("Are you sure you want to delete this alumni?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/alumni/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alumni Management</h1>
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
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedAlumni(expandedAlumni === alum._id ? null : alum._id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{alum.name}</span>
                <span className="text-sm text-gray-600">
                  {alum.graduationYear} - {alum.department}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(alum);
                  }}
                >
                  <FiEdit2 className="inline mr-1" /> Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(alum._id);
                  }}
                >
                  <FiTrash2 className="inline mr-1" /> Delete
                </button>
                {expandedAlumni === alum._id ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>

            {expandedAlumni === alum._id && (
              <div className="mt-4 border-t pt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Contact Details</h3>
                    <p><strong>Email:</strong> {alum.email}</p>
                    <p><strong>Phone:</strong> {alum.phone}</p>
                    {alum.linkedin && (
                      <p>
                        <strong>LinkedIn:</strong>{" "}
                        <a
                          href={alum.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Profile
                        </a>
                      </p>
                    )}
                  </div>
                  <div>
                    {alum.imageUrl && (
                      <div>
                        <h3 className="font-semibold mb-3">Profile Image</h3>
                        <div className="bg-white p-2 rounded border">
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
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">
          {editData ? "Edit Alumni" : "Add New Alumni"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Graduation Year*</label>
              <input
                type="text"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="YYYY"
                pattern="\d{4}"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department*</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Current Position</label>
              <input
                type="text"
                name="currentPosition"
                value={formData.currentPosition}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                pattern="[0-9]{10}"
                placeholder="10-digit phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn Profile*</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="https://linkedin.com/in/username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Image*</label>
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