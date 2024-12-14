// src/services/cartService.js
import api from './api';

const cartService = {
  // Lấy giỏ hàng của user
  getCart: async () => {
    try {
      const response = await api.get('/carts');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Thêm khóa học vào giỏ hàng
  addToCart: async (courseId) => {
    try {
      const response = await api.post('/carts', { courseId });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Xóa giỏ hàng của user
  deleteCart: async () => {
    try {
      const response = await api.delete('/carts');
      return response.data;
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw error;
    }
  },

  // Xóa một món hàng trong giỏ
  deleteCartItem: async (itemId) => {
    try {
      const response = await api.delete(`/carts/item/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      throw error;
    }
  }
};
export default cartService;