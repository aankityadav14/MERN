import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUserPlus,
  FaCalendarPlus,
  FaBell,
  FaImages,
  FaTable,
  FaBook,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaUsers,
} from "react-icons/fa";
import FacultyForm from "./FacultyForm";
import EventForm from "./EventForm";
import NoticeForm from "./NoticeForm";
import GalleryForm from "./GalleryForm";
import TimeTableForm from "./TimeTableForm";
import AcademicForm from "./AcademicForm";
import MentorMenteeForm from "./MentorMenteeForm";
import Aluminia from "./Aluminia";
import axios from "axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("faculty");
  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "faculty",
      label: "Faculty",
      icon: <FaUserPlus />,
      color: "bg-blue-500",
    },
    {
      id: "event",
      label: "Events",
      icon: <FaCalendarPlus />,
      color: "bg-green-500",
    },
    {
      id: "notice",
      label: "Notices",
      icon: <FaBell />,
      color: "bg-yellow-500",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: <FaImages />,
      color: "bg-purple-500",
    },
    {
      id: "timetable",
      label: "Timetable",
      icon: <FaTable />,
      color: "bg-indigo-500",
    },
    {
      id: "academic",
      label: "Academic",
      icon: <FaBook />,
      color: "bg-pink-500",
    },
    {
      id: "mentor-mentee",
      label: "Mentor-Mentee",
      icon: <FaUsers />,
      color: "bg-orange-500",
    },
    {
      id:"aluminia",
      label:"Aluminia",
      icon:<FaUsers/>,
      color:"bg-red-500"
    }
  ];

  // useEffect(() => {
  //   fetchData();
  // }, [activeTab]);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/${activeTab}`
  //     );
  //     setData(response.data);
  //   } catch (error) {
  //     toast.error("Error fetching data");
  //   }
  // };

  const handleLogout = () => {
    toast.info("Logged out successfully");
    localStorage.clear();
    navigate("/login");
  };

  // const handleDelete = async (id) => {
  //   try {
  //     const endpoint =
  //       activeTab === "mentor-mentee" ? "mentor-mentee" : activeTab;
  //     await axios.delete(`http://localhost:5000/api/${endpoint}/${id}`);
  //     toast.success(
  //       `${
  //         menuItems.find((item) => item.id === activeTab)?.label
  //       } deleted successfully`
  //     );
  //     fetchData();
  //     setShowDeleteModal(false);
  //     setSelectedItem(null);
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //     toast.error(error.response?.data?.message || "Error deleting item");
  //   }
  // };

  const handleUpdate = (item) => {
    const itemName =
      item.mentorName || item.facultyName || item.title || item.name;
    setEditData(item);
    toast.info(`Editing ${itemName}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 min-h-screen">
        <div className="p-4">
          <h1 className="text-white text-xl font-bold mb-6">Admin Dashboard</h1>
        </div>
        <nav className="space-y-2 px-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-300 ${
                activeTab === item.id
                  ? `${item.color} text-white`
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-300 text-red-400 hover:bg-red-900 hover:text-red-200 mt-8"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              {/* Forms */}
              {activeTab === "faculty" && (
                <FacultyForm
                  editData={editData}
                  onSubmitSuccess={() => {
                    // fetchData();
                    setEditData(null);
                  }}
                />
              )}
              {activeTab === "event" && (
                <EventForm
                  editData={editData}
                  onSubmitSuccess={() => {
                    // fetchData();
                    setEditData(null);
                  }}
                />
              )}
              {activeTab === "notice" && (
                <NoticeForm
                  editData={editData}
                  onSubmitSuccess={() => {
                    // fetchData();
                    setEditData(null);
                  }}
                />
              )}
              {activeTab === "gallery" && (
                <GalleryForm
                  editData={editData}
                  onSubmitSuccess={() => {
                    // fetchData();
                    setEditData(null);
                  }}
                />
              )}
              {activeTab === "timetable" && (
                <TimeTableForm
                  editData={editData}
                  onSubmitSuccess={() => {
                    // fetchData();
                    setEditData(null);
                  }}
                />
              )}
              {activeTab === "academic" && (
                <AcademicForm
                  editData={editData}
                  onSubmitSuccess={() => {
                    // fetchData();
                    setEditData(null);
                  }}
                />
              )}
              {activeTab === "mentor-mentee" && (
                <MentorMenteeForm
                  editData={editData}
                  onSubmitSuccess={() => {
                    // fetchData();
                    setEditData(null);
                  }}
                />
              )}
              {activeTab === "aluminia" && (
                <Aluminia
                  editData={editData}
                  onSubmitSuccess={() => {
                    // fetchData();
                    setEditData(null);
                  }}
                />
              )}

              {/* Data List */}
              {/* <div className="mt-6 space-y-4">
                {data.map((item) => (
                  <div
                    key={item._id}
                    className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 transition duration-150"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.mentorName ||
                          item.facultyName ||
                          item.title ||
                          item.name}
                      </span>
                      {item.department && (
                        <span className="text-sm text-gray-600">
                          {item.department} -{" "}
                          {item.semester || item.academicYear}
                        </span>
                      )}
                    </div>
                    <div className="space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleUpdate(item)}
                      >
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrash className="inline mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this{" "}
              {menuItems.find((item) => item.id === activeTab)?.label}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDelete(selectedItem._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
