// src/services/userService.js
import api from './api'; // Import cấu hình api từ file api.js

const userService = {
  // Hàm lấy thông tin người dùng dựa trên userId
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error; // Ném lỗi để có thể bắt lỗi ở component gọi API
    }
  },

  // Bạn có thể thêm nhiều hàm khác để thao tác với user, ví dụ: cập nhật thông tin, thay đổi mật khẩu...
  // Trong userService
  getMyCourses  : async (userId) => {
  // API call để lấy danh sách khóa học đã mua
  const response = await api.get(`/enrollments/user/${userId}`);
  return response.data;
}
};

export default userService;
