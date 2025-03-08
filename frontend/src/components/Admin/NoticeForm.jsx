import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

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

const NoticeForm = () => {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [noticeData, setNoticeData] = useState({
    title: "",
    content: "",
    issuedBy: "",
    description: "",
    date: "",
  });

  // Fetch all notices
  const fetchNotices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notices");
      setNotices(response.data);
    } catch (error) {
      toast.error("Failed to fetch notices");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => {
    setNoticeData({ ...noticeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editData?._id) {
        await axios.put(
          `http://localhost:5000/api/notices/${editData._id}`,
          noticeData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Notice updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/notices", noticeData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Notice added successfully");
      }
      
      setNoticeData({ title: "", description: "", date: "", issuedBy: "", content: "" });
      setIsModalOpen(false);
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
    }
  };

  const handleEdit = (notice) => {
    setEditData(notice);
    setNoticeData({
      title: notice.title || "",
      content: notice.content || "",
      issuedBy: notice.issuedBy || "",
      description: notice.description || "",
      date: notice.date ? notice.date.split('T')[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/notices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Notice deleted successfully");
        fetchNotices();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete notice");
      }
    }
  };

  const handleCreateNew = () => {
    setEditData(null);
    setNoticeData({
      title: "",
      content: "",
      issuedBy: "",
      description: "",
      date: "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notice Management</h1>
        <button
          onClick={handleCreateNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Notice
        </button>
      </div>

      {/* Notices List */}
      <div className="mt-6 space-y-4">
        {notices.map((notice) => (
          <div
            key={notice._id}
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedNotice(expandedNotice === notice._id ? null : notice._id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{notice.title}</span>
                <span className="text-sm text-gray-600">
                  Issued By: {notice.issuedBy} - {new Date(notice.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(notice);
                  }}
                >
                  <FiEdit2 className="inline mr-1" /> Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notice._id);
                  }}
                >
                  <FiTrash2 className="inline mr-1" /> Delete
                </button>
                {expandedNotice === notice._id ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedNotice === notice._id && (
              <div className="mt-4 border-t pt-4">
                <div className="grid gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-gray-700">{notice.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Content</h3>
                    <p className="text-sm text-gray-700">{notice.content}</p>
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
          {editData ? "Edit Notice" : "Add New Notice"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={noticeData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <input
              type="text"
              name="content"
              value={noticeData.content}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Issued By</label>
            <input
              type="text"
              name="issuedBy"
              value={noticeData.issuedBy}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={noticeData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={noticeData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {editData ? "Update Notice" : "Add Notice"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default NoticeForm;
