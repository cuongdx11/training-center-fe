import axios from './api';


export const checkEnrollment = async (userId, courseId) => {
    const response = await axios.get(`/enrollment/check?userId=${userId}&courseId=${courseId}`);
    return response.data; // Giả định trả về { enrolled: true/false }
};

export const getStudentEnrollments = async () => {
    try {
        const response = await axios.get(`/enrollments/students`);
        return response.data; 
    }
    catch(error) {
        throw error; 
    }
}

export const statisticsEnrollment = async () => {
    try {
        const response = await axios.get(`/statistics/enrollments`);
        return response.data; 
    }
    catch(error) {
        throw error; 
    }
}
