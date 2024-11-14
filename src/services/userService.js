import api from "./api";

const userService = {
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },

  getMyCourses: async (userId) => {
    const response = await api.get(`/enrollments/user/${userId}`);
    return response.data;
  },

  getInstructors: async () => {
    const response = await api.get(`/users/instructors`);
    return response.data;
  },
  getAllUsers: async () => {
    try {
      const response = await api.get(`/users`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserRoles: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.roles;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
