import api from './api';

export const getMonthlyRevenue = (fromDate, toDate) => {
    return api.get(`/statistics/revenue`, {
        params: { from: fromDate, to: toDate }
    });
}

export const getRevenueByCourse = (fromDate, toDate) => {
    return api.get(`/statistics/revenue-by-course`, {
        params: { from: fromDate, to: toDate }
    });
}

export const getNewestEnrollments = async () => {
    try {
        const response = await api.get(`/statistics/newest`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUserStatistics = async () => {
    try {
        const response = await api.get('/statistics/users');
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getInstructorStatistics = async () => {
    try {
      const response = await api.get('/statistics/instructor');
      return response.data;
    } catch (error) {
      throw error;
    }
  };