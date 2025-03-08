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

const GalleryForm = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [galleryData, setGalleryData] = useState({
    title: "",
    type: "image",
    media: null,
  });

  const formatMediaUrl = (url) => {
    if (!url) return "";
    const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const fetchGalleryItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/gallery");
      setGalleryItems(response.data);
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
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", galleryData.title);
    formData.append("type", galleryData.type);
    if (galleryData.media) {
      formData.append("media", galleryData.media);
    }

    try {
      if (editData?._id) {
        await axios.put(
          `http://localhost:5000/api/gallery/${editData._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Gallery item updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/gallery", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
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
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/gallery/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery Management</h1>
        <button
          onClick={handleCreateNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Item
        </button>
      </div>

      {/* Gallery Items List */}
      <div className="mt-6 space-y-4">
        {galleryItems.map((item) => (
          <div
            key={item._id}
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{item.title}</span>
                <span className="text-sm text-gray-600">Type: {item.type}</span>
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
                  {item.mediaUrl && (
                    <div>
                      <h3 className="font-semibold mb-3">Preview</h3>
                      <div className="bg-white p-2 rounded border">
                        {item.type === "image" ? (
                          <img
                            src={formatMediaUrl(item.mediaUrl)}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                        ) : (
                          <video
                            src={item.mediaUrl}
                            controls
                            className="w-full h-48 object-cover rounded"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
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
          {editData ? "Edit Gallery Item" : "Add New Gallery Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={galleryData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={galleryData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Media File</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept={galleryData.type === "image" ? "image/*" : "video/*"}
              className="mt-1 block w-full"
              required={!editData?._id}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FiUpload className="mr-2" />
            {editData ? "Update Item" : "Add Item"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default GalleryForm;