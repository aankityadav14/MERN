import axios from 'axios';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const academicAPI = {
    getAllResources: async () => {
        const response = await axios.get(`${BASE_URL}/academic`);
        return response.data;
    },

    createResource: async (formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/academic`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateResource: async (id, formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_URL}/academic/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    deleteResource: async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/academic/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export const achievementAPI = {
    getAllAchievements: async () => {
        const response = await axios.get(`${BASE_URL}/achievements`);
        return response.data;
    },

    createAchievement: async (formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/achievements`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateAchievement: async (id, formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_URL}/achievements/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    deleteAchievement: async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/achievements/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export const alumniAPI = {
    getAllAlumni: async () => {
        const response = await axios.get(`${BASE_URL}/alumni`);
        return response.data;
    },

    createAlumni: async (formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/alumni`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateAlumni: async (id, formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_URL}/alumni/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    deleteAlumni: async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/alumni/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export const eventAPI = {
    getAllEvents: async () => {
        const response = await axios.get(`${BASE_URL}/events`);
        return response.data;
    },

    createEvent: async (formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/events`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateEvent: async (id, formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_URL}/events/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    deleteEvent: async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/events/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export const facultyAPI = {
    getAllFaculty: async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/faculty`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    createFaculty: async (formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/faculty`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateFaculty: async (id, formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_URL}/faculty/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    deleteFaculty: async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/faculty/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export const galleryAPI = {
    getAllGalleryItems: async () => {
        const response = await axios.get(`${BASE_URL}/gallery`);
        return response.data;
    },

    createGalleryItem: async (formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/gallery`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateGalleryItem: async (id, formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_URL}/gallery/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    deleteGalleryItem: async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/gallery/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export const mentorMenteeAPI = {
    getAllRecords: async () => {
        const response = await axios.get(`${BASE_URL}/mentor-mentee`);
        return response.data;
    },

    createRecord: async (formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/mentor-mentee`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateRecord: async (id, formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_URL}/mentor-mentee/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    deleteRecord: async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/mentor-mentee/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export const noticeAPI = {
    getAllNotices: async () => {
        const response = await axios.get(`${BASE_URL}/notices`);
        return response.data;
    },

    createNotice: async (formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/notices`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateNotice: async (id, formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_URL}/notices/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    deleteNotice: async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/notices/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export const timetableAPI = {
    getAllTimetables: async () => {
        const response = await axios.get(`${BASE_URL}/timetable`);
        return response.data;
    },

    createTimetable: async (formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/timetable`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateTimetable: async (id, formData) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_URL}/timetable/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    deleteTimetable: async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/timetable/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export const userAPI = {
    getAllUsers: async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/auth/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    createUser: async (userData) => {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    updateUser: async (id, userData) => {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_URL}/auth/user/${id}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    deleteUser: async (id) => {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/auth/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export const showDeleteConfirmation = async (itemName) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You want to delete this ${itemName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
    });

    return result.isConfirmed;
};
