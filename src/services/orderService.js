import api from './api';

export const orderService = {
  async checkout(paymentMethodId) {
    try {
      const response = await api.post('orders/check-out', { paymentMethodId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await api.get(`orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserOrders() {
    try {
      const response = await api.get('orders/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};