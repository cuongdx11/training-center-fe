import api from './api';

export const createAssignment = async (data) => {
    try {
        const response = await api.post('/assignments', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAssignment = async (assignmentId, data) => {
    try {
        const response = await api.put(`/assignments/${assignmentId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAssignment = async (assignmentId) => {
    try {
        const response = await api.delete(`/assignments/${assignmentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllAssignments = async () => {
    try {
        const response = await api.get('/assignments');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllCourseClasses = async () => {
    try {
        const response = await api.get('/classes/instructor');
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getStudentSubmissions = async (assignmentId) => {
    try {
        const response = await api.get(`/student-submissions/assignments/${assignmentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAssignmentDetails = async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}`);
    return response.data;
};


export const getAssignmentsOfStudent = async () => {
    try {
        const response = await api.get('/assignments/student');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAssignmentsOfInstructor = async () => {
    try {
        const response = await api.get('/assignments/instructor');
        return response.data;
    } catch (error) {
        throw error;
    }
};

