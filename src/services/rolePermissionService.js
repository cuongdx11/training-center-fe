
import axios from './api';


export const rolePermissionService = {
    addPermissionToRole: async (roleId, permissionId) => {
        try {
            const response = await axios.post(`/role-permissions`, {
                roleId,
                permissionId
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    removePermissionFromRole: async (rolePermissionId) => {
        try {
            const response = await axios.delete(`/role-permissions/${rolePermissionId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};