
import axios from './api';


export const rolePermissionService = {
    addPermissionToRole: async (roleId, permissionId) => {
        try {
            const response = await axios.post(`/roles/permission`, {
                roleId,
                permissionId
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    removePermissionFromRole: async (roleId,permissionId) => {
        try {
            const response = await axios.delete(`/roles/${roleId}/permission/${permissionId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};