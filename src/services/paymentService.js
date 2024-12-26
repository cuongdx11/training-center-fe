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
  async getFilteredPayments({ page = 0, size = 5, status, orderId, fromDate, toDate }) {
    try {
      // Chuẩn bị query parameters
      const params = {
        page,
        size,
        ...(status && { status }),
        ...(orderId && { orderId }),
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
      };

      // Gửi request đến server
      const response = await api.get('/payments/all', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered payments:', error);
      throw error;
    }
  },
  async updatePaymentStatus(paymentId, isSuccess) {
    try {
      // Gửi request để cập nhật trạng thái thanh toán
      const response = await api.put(`payments/${paymentId}/status`, null, {
        params: { isSuccess },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },
};