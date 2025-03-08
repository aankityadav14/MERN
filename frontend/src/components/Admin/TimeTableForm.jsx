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

const TimeTableForm = () => {
  const [timeTables, setTimeTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [timeTableData, setTimeTableData] = useState({
    year: "",
    facultyName: "",
    media: null,
  });

  // Update the formatMediaUrl and add getGoogleDriveFileId functions
  const getGoogleDriveFileId = (url) => {
    if (!url) return null;
    if (url.includes("drive.google.com")) {
      return url.match(/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
    }
    return null;
  };

  // Update the formatMediaUrl function
  const formatMediaUrl = (url) => {
    if (!url) return "";
    const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  const fetchTimeTables = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/timetable");
      setTimeTables(response.data);
    } catch (error) {
      toast.error("Failed to fetch timetables");
    }
  };

  useEffect(() => {
    fetchTimeTables();
  }, []);

  const handleChange = (e) => {
    setTimeTableData({ ...timeTableData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setTimeTableData({ ...timeTableData, media: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("year", timeTableData.year);
    formData.append("facultyName", timeTableData.facultyName);
    if (timeTableData.media) {
      formData.append("media", timeTableData.media);
    }

    try {
      if (editData?._id) {
        await axios.put(
          `http://localhost:5000/api/timetable/${editData._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Timetable updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/timetable", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Timetable added successfully");
      }
      
      setTimeTableData({ year: "", facultyName: "", media: null });
      setIsModalOpen(false);
      fetchTimeTables();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setTimeTableData({
      year: item.year || "",
      facultyName: item.facultyName || "",
      media: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this timetable?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/timetable/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Timetable deleted successfully");
        fetchTimeTables();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete timetable");
      }
    }
  };

  const handleCreateNew = () => {
    setEditData(null);
    setTimeTableData({
      year: "",
      facultyName: "",
      media: null,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Timetable Management</h1>
        <button
          onClick={handleCreateNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Timetable
        </button>
      </div>

      {/* Timetable List */}
      <div className="mt-6 space-y-4">
        {timeTables.map((item) => (
          <div
            key={item._id}
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{item.year}</span>
                <span className="text-sm text-gray-600">Faculty: {item.facultyName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                >
                  <FiEdit2 className="inline mr-1" /> Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                >
                  <FiTrash2 className="inline mr-1" /> Delete
                </button>
                {expandedItem === item._id ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedItem === item._id && (
              <div className="mt-4 border-t pt-4">
                <div className="grid gap-4">
                  {item.media && (
                    <div>
                      <h3 className="font-semibold mb-3">Preview</h3>
                      <div className="bg-white p-2 rounded border">
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            src={formatMediaUrl(item.media)}
                            className="w-full h-[600px] rounded-lg"
                            frameBorder="0"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                        <div className="mt-4 text-center">
                          <a
                            href={item.media}
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
          {editData ? "Edit Timetable" : "Add New Timetable"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="text"
              name="year"
              value={timeTableData.year}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Faculty Name</label>
            <input
              type="text"
              name="facultyName"
              value={timeTableData.facultyName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload File</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="application/pdf,image/*"
              className="mt-1 block w-full"
              required={!editData?._id}
            />
            <p className="mt-1 text-sm text-gray-500">
              Supported formats: PDF, Images
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FiUpload className="mr-2" />
            {editData ? "Update Timetable" : "Add Timetable"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default TimeTableForm;