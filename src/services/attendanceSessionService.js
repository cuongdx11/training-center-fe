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