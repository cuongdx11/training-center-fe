import api from "./api";

const userService = {
  getProfileUser: async () => {
    try {
      const response = await api.get(`/users/profile`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },
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
      return response.data.content;
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
  addUser: async (userData) => {
    try {
      const formData = new FormData();
      for (const key in userData) {
        formData.append(key, userData[key]);
      }
  
      const response = await api.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateUser: async (userId, userData) => {
    try {
      const formData = new FormData();
      for (const key in userData) {
        formData.append(key, userData[key]);
      }
  
      const response = await api.put(`/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    }
    catch (error) {
      throw error;
    }
  },
  blockUser: async (blockUserRequest) => {
    try {
      const response = await api.post('/users/block', blockUserRequest);
      return response.data; 
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }
  
};

export default userService;
