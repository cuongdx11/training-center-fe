import axios from './api';



export const permissionService = {
    getAllPermissions: async () => {
        try {
            const response = await axios.get(`/permissions`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addPermission: async (permissionData) => {
        try {
            const response = await axios.post(`/permissions`, permissionData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};