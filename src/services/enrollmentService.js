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

export const getUserEnrollments = async ({ status, courseName, page = 0, size = 5 }) => {
    try {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (courseName) params.append("courseName", courseName);
        params.append("page", page);
        params.append("size", size);

        const response = await axios.get(`/enrollments/user?${params.toString()}`);
        return response.data; // Trả về PagedResponse từ backend
    } catch (error) {
        throw error;
    }
};

export const checkCourseEnrollment = async (courseId) => {
    try {
      const response = await axios.get(`/enrollments/check`, {
        params: {
          courseId: courseId
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to check enrollment status');
    }
  };