import api from './api';


export const createConsult = async (data) => {
    try {
        const response = await api.post('/consults', data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getAllConsults = async () => {
    try {
        const response = await api.get('/consults');
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const getConsultById = async (consultId) => {
    try {
        const response = await api.get(`/consults/${consultId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
export const updateConsults = async (consultId,data) => {
    try {
        const response = await api.put(`/consults/${consultId}`,data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const deleteConsults = async (consultId) => {
    try {
        const response = await api.delete(`/consult/${consultId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

