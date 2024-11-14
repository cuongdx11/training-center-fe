import axios from './api';

export const roleService = {
    getAllRoles: async () => {
        try {
            const response = await axios.get(`/roles`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addRole: async (roleData) => {
        try {
            const response = await axios.post(`/roles`, roleData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateRole: async (roleId, roleData) => {
        try {
            const response = await axios.put(`/roles/${roleId}`, roleData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteRole: async (roleId) => {
        try {
            const response = await axios.delete(`/roles/${roleId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};