import api from './api';

/**
 * Nộp bài cho một assignment
 * @param {FormData} data - Dữ liệu bài nộp (bao gồm file và assignmentId)
 * @returns {Promise<Object>} - Kết quả trả về từ API
 */
export const createStudentSubmission = async (data) => {
    try {
        const response = await api.post('/student-submissions', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Lấy danh sách bài nộp của một assignment
 * @param {string} assignmentId - ID của assignment
 * @returns {Promise<Array>} - Danh sách bài nộp
 */
export const getStudentSubmissions = async (assignmentId) => {
    try {
        const response = await api.get(`/student-submissions/assignments/${assignmentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Cập nhật bài nộp của học viên
 * @param {FormData} data - Dữ liệu bài nộp mới (bao gồm file và assignmentId)
 * @returns {Promise<Object>} - Kết quả trả về từ API
 */
export const updateStudentSubmission = async (data) => {
    try {
        const response = await api.put('/student-submissions', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Cập nhật bài nộp của học viên bởi giảng viên
 * @param {Object} data - Dữ liệu cập nhật (bao gồm score, feedBack, status, assignmentId)
 * @returns {Promise<Object>} - Kết quả trả về từ API
 */
export const updateStudentSubmissionByInstructor = async (data) => {
    try {
        const response = await api.put('/student-submissions/instructor', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getStudentSubmissionForAssignment = async (assignmentId) => {
    try {
        const response = await api.get(`/student-submissions/assignments/${assignmentId}/student`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

