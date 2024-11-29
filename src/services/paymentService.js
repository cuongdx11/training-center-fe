import api from './api';

export const paymentService = {
  async getPaymentMethods() {
    try {
      const response = await api.get('payment-method');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getPayments() {
    try {
      const response = await api.get('payments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};