import axios from './api';


export const checkEnrollment = async (userId, courseId) => {
    const response = await axios.get(`/api/enrollment/check?userId=${userId}&courseId=${courseId}`);
    return response.data; // Giả định trả về { enrolled: true/false }
};