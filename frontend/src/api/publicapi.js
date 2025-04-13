import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';



///login
export const login = async (credentials) => { 
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
        return response;
    } catch (error) {
        throw error;
    }
};



// Home Page APIs
// get all faculty
export const getAllFaculty = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/faculty`);
        return response.data;
    } catch (error) {
        throw error;
    }   
}

// get all achievements
export const getAllAchievements = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/achievements`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


// Events APIs
export const getAllEvents = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/events`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Alumni APIs
export const getAlumniList = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/alumni`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Notice APIs
export const getAllNotices = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/notices`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Timetable APIs
export const getTimetableData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/timetable`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Gallery APIs
export const getGalleryImages = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/gallery`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Academic APIs
export const getAcademicInfo = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/academic`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Authentication APIs
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Mentor-Mentee APIs
export const getMentorMenteeData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/mentor-mentee`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Notice APIs - Extended
export const getLatestNotices = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/notices/latest`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getNoticeById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/notices/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Events APIs - Extended
export const getUpcomingEvents = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/events/upcoming`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getEventById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/events/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Gallery APIs - Extended
export const getGalleryCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/gallery/categories`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getImagesByCategory = async (category) => {
    try {
        const response = await axios.get(`${BASE_URL}/gallery/category/${category}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Academic APIs - Extended
export const getDepartmentInfo = async (department) => {
    try {
        const response = await axios.get(`${BASE_URL}/academic/department/${department}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSyllabus = async (course) => {
    try {
        const response = await axios.get(`${BASE_URL}/academic/syllabus/${course}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Timetable APIs - Extended
export const getTimetableByClass = async (className) => {
    try {
        const response = await axios.get(`${BASE_URL}/timetable/${className}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTimetableByTeacher = async (teacherId) => {
    try {
        const response = await axios.get(`${BASE_URL}/timetable/teacher/${teacherId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
