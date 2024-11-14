import axios from './api';


export const userRoleService = {
    assignRoleToUser: async (userId, roleId) => {
        try {
            const response = await axios.post(`/user-role`, {
                userId,
                roleId
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    removeRoleFromUser: async (userId,roleId) => {
        try {
            const response = await axios.delete(`/user-role/${userId}/role/${roleId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};