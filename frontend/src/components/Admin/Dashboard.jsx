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
  FaChartLine,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import FacultyForm from "./FacultyForm";
import EventForm from "./EventForm";
import NoticeForm from "./NoticeForm";
import GalleryForm from "./GalleryForm";
import TimeTableForm from "./TimeTableForm";
import AcademicForm from "./AcademicForm";
import MentorMenteeForm from "./MentorMenteeForm";
import Aluminia from "./Aluminia";
import AchievementForm from "./AchievementForm";
import UserForm from './UserForm';
import axios from "axios";
import { color } from "framer-motion";
import { useTheme } from '../../context/ThemeContext';

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("event");
  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const isadmin = localStorage.getItem("role") === "admin";
  const menuItems = [
    {
      id: "event",
      label: "Events",
      icon: <FaCalendarPlus />,
      color: "from-green-500 to-green-600",
      description: "Manage department events",
    },
    {
      id: "notice",
      label: "Notices",
      icon: <FaBell />,
      color: "from-yellow-500 to-yellow-600",
      description: "Manage notices and announcements",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: <FaImages />,
      color: "from-purple-500 to-purple-600",
      description: "Manage photo gallery",
    },
    {
      id: "timetable",
      label: "Timetable",
      icon: <FaTable />,
      color: "from-indigo-500 to-indigo-600",
      description: "Manage class schedules",
    },
    {
      id: "academic",
      label: "Academic",
      icon: <FaBook />,
      color: "from-pink-500 to-pink-600",
      description: "Manage academic information",
    },
    {
      id: "mentor-mentee",
      label: "Mentor-Mentee",
      icon: <FaUsers />,
      color: "from-orange-500 to-orange-600",
      description: "Manage mentor-mentee pairs",
    },
    {
      id: "aluminia",
      label: "Alumni",
      icon: <FaUsers />,
      color: "from-red-500 to-red-600",
      description: "Manage alumni information",
    },
    {
      id:"achievement",
      label:"Achievement",
      icon:<FaChartLine />,
      color: "from-red-500 to-red-600",
      description:"Manage Achievement Information"
    }
  ].concat(
    // Only add Users menu item if user is admin
    isadmin ? [{
      id: "users",
      label: "Users",
      icon: <FaCog />,
      color: "from-teal-500 to-teal-600",
      description: "Manage Users and Permissions"
    },
    {
      id: "faculty",
      label: "Faculty",
      icon: <FaUserPlus />,
      color: "from-blue-500 to-blue-600",
      description: "Manage faculty members",
    },
  ] : []
  );

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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo and Title */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">IT Department</p>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs opacity-75">{item.description}</span>
                </div>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-300"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-0" : "lg:ml-80"}`}>
        <div className="p-8">
          {/* Content Area */}
          <div className={`rounded-2xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {activeTab === "faculty" && isadmin && (
              <FacultyForm
                editData={editData}
                onSubmitSuccess={() => {
                  setEditData(null);
                }}
              />
            )}
            {activeTab === "event" && (
              <EventForm
                editData={editData}
                onSubmitSuccess={() => {
                  setEditData(null);
                }}
              />
            )}
            {activeTab === "notice" && (
              <NoticeForm
                editData={editData}
                onSubmitSuccess={() => {
                  setEditData(null);
                }}
              />
            )}
            {activeTab === "gallery" && (
              <GalleryForm
                editData={editData}
                onSubmitSuccess={() => {
                  setEditData(null);
                }}
              />
            )}
            {activeTab === "timetable" && (
              <TimeTableForm
                editData={editData}
                onSubmitSuccess={() => {
                  setEditData(null);
                }}
              />
            )}
            {activeTab === "academic" && (
              <AcademicForm
                editData={editData}
                onSubmitSuccess={() => {
                  setEditData(null);
                }}
              />
            )}
            {activeTab === "mentor-mentee" && (
              <MentorMenteeForm
                editData={editData}
                onSubmitSuccess={() => {
                  setEditData(null);
                }}
              />
            )}
            {activeTab === "aluminia" && (
              <Aluminia
                editData={editData}
                onSubmitSuccess={() => {
                  setEditData(null);
                }}
              />
            )}
            {activeTab === "achievement" && (
              <AchievementForm
                editData={editData}
                onSubmitSuccess={() => {
                  setEditData(null);
                }}
              />
            )}
            {activeTab === "users" && isadmin ? (
              <UserForm
                editData={editData}
                onSubmitSuccess={() => {
                  setEditData(null);
                }}
              />
            ) : activeTab === "users" ? (
              <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <FaCog className="mx-auto text-5xl mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
                <p>You need administrator privileges to access this section.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
