import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiCheck, FiPlus, FiUser, FiMail, FiLock, FiBriefcase } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { userAPI, showDeleteConfirmation } from '../../api/privateapi';

// Modal Component (same as FacultyForm)
const Modal = ({ isOpen, onClose, children }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl"
            >
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
              />

              {/* Modal Content */}
              <div className={`relative rounded-2xl shadow-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } p-6`}>
                <button
                  onClick={onClose}
                  className={`absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors ${
                    isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500'
                  }`}
                >
                  <FiX className="text-xl" />
                </button>
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const UserForm = () => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    currentPassword: '',
    role: 'faculty',
  });

  const roles = ['admin', 'faculty'];
  // const departments = ['Computer Science', 'Information Technology', 'Mathematics', 'Physics', 'Chemistry'];

  const fetchUsers = async () => {
    try {
      const data = await userAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editData?._id) {
        const updatePayload = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };

        if (formData.password) {
          updatePayload.currentPassword = formData.currentPassword;
          updatePayload.newPassword = formData.password;
        }

        await userAPI.updateUser(editData._id, updatePayload);
        toast.success('User updated successfully');
      } else {
        await userAPI.createUser(formData);
        toast.success('User created successfully');
      }

      setFormData({
        name: '',
        email: '',
        password: '',
        currentPassword: '',
        role: 'faculty',
      });
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (await showDeleteConfirmation('user')) {
      try {
        await userAPI.deleteUser(id);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleEdit = (user) => {
    setEditData(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      currentPassword: '',
      role: user.role,
    });
    setIsModalOpen(true);
  };

  return (
    <div className={`container mx-auto p-4 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          User Management
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditData(null);
            setFormData({
              name: '',
              email: '',
              password: '',
              currentPassword: '',
              role: 'faculty',
            });
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiPlus className="text-xl" />
          Add New User
        </motion.button>
      </div>

      {/* Users List */}
      <div className="grid gap-6">
        {users.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-xl font-semibold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {user.name}
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {user.role} 
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-400 hover:bg-blue-700 rounded-lg transition-colors"
                    onClick={() => handleEdit(user)}
                  >
                    <FiEdit2 className="text-xl" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-red-400 hover:bg-red-700 rounded-lg transition-colors"
                    onClick={() => handleDelete(user._id)}
                  >
                    <FiTrash2 className="text-xl" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {editData ? 'Edit User' : 'Add New User'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Full Name
              </label>
              <div className="relative">
                <FiUser className={`absolute left-3 top-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter user's full name"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <FiMail className={`absolute left-3 top-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              {editData ? (
                <>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Current Password
                    </label>
                    <div className="relative">
                      <FiLock className={`absolute left-3 top-3 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      New Password (Leave blank to keep current)
                    </label>
                    <div className="relative">
                      <FiLock className={`absolute left-3 top-3 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className={`absolute left-3 top-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Role
              </label>
              <div className="relative">
                <FiBriefcase className={`absolute left-3 top-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={`px-6 py-2 rounded-xl border transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FiCheck className="text-lg" />
                  {editData ? 'Update User' : 'Create User'}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserForm;
