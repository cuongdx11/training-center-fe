import api from './api';



export const addAttendance = async(data) => {
    try {
        const response =  await api.post('/attendances', data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const checkIn = async (sessionId) => {
    try {
        const response = await api.post('/attendances/checkin?sessionId=' + sessionId);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}