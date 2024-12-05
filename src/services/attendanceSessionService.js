import api from './api';



export const createAttendanceSession = async (data) => {
    try {
        const response = await api.post('/attendance-session',data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export const getAttendanceSessionDetails = async (sessionId) => {
    try {
        const response = await api.get(`/attendance-session/${sessionId}/details`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export const getAttendanceSessionOfClass= async (classId) => {
    try {
        const response = await api.get(`/attendance-session/classes/${classId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


