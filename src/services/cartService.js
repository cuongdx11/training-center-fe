// src/services/cartService.js
import api from './api';

const cartService = {
  // Lấy giỏ hàng của user
  getCart: async (userId) => {
    try {
      const response = await api.get(`/carts/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Thêm khóa học vào giỏ hàng
  addToCart: async (userId, courseId, quantity = 1) => {
    try {
      const response = await api.post('/carts', {
        userId: userId,
        courseId: courseId,
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
};

export default cartService;