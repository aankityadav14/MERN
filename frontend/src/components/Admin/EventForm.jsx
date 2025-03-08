import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiUpload,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>
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

const EventForm = () => {
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
      const response = await axios.get("http://localhost:5000/api/events");
      setEvents(response.data);
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
      eventFormData.append("image", formData.imageUrl); // Change "media" to "image" to match API
    }
    const token = localStorage.getItem("token");
    console.log(token);

    try {
      if (editData?._id) {
        // Update the edit request

        await axios.put(
          `http://localhost:5000/api/events/${editData._id}`,
          eventFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Add auth token
            },
          }
        );
        toast.success("Event updated successfully");
      } else {
        // Create request remains the same
        await axios.post("http://localhost:5000/api/events", eventFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
          },
        });
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <button
          onClick={handleCreateNew}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Create New Event
        </button>
      </div>

      {/* Events List */}
      <div className="mt-6 space-y-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setExpandedEvent(expandedEvent === event._id ? null : event._id)
              }
            >
              <div className="flex flex-col">
                <span className="font-medium">{event.title}</span>
                <span className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString()} at{" "}
                  {event.location}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(event);
                  }}
                >
                  <FiEdit2 className="inline mr-1" /> Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event._id);
                  }}
                >
                  <FiTrash2 className="inline mr-1" /> Delete
                </button>
                {expandedEvent === event._id ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </div>
            </div>

            {expandedEvent === event._id && (
              <div className="mt-4 border-t pt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Event Details</h3>
                    <p className="text-gray-600">{event.description}</p>
                    <div className="mt-2">
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Location:</strong> {event.location}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(event.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div>
                      {event.imageUrl && (
                        <div>
                          <h3 className="font-semibold mb-3">Event Image</h3>
                          <div className="bg-white p-2 rounded border">
                            <img
                              src={getGoogleDriveImage(event.imageUrl)}
                              alt={event.title}
                              className="w-full h-auto object-contain rounded"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/150?text=No+Image";
                              }}
                            />
                            <a
                              href={event.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 text-blue-600 hover:underline flex items-center justify-center"
                            >
                              <FiUpload className="mr-2" />
                              View Original
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
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
          {editData ? "Edit Event" : "Create New Event"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Event Image
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required={!editData?._id}
              />
              <p className="mt-1 text-sm text-gray-500">
                Accepted formats: Images (JPG, PNG, etc.)
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FiUpload className="mr-2" />
            {editData?._id ? "Update Event" : "Create Event"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EventForm;
