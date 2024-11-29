import api from './api';


export const addUserToClass = async (data) => {
    try {
        const response = await api.post(`/class-students`,data);
        return response.data;
    }
    catch (error) {
        throw error;
    }

}