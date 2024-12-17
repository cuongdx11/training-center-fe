import api from './api';

export const getNotifications = async () => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const markAllNotificationsAsRead = async () => {
    try {
        const response = await api.put('/notifications/mark-all-read');
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await api.put(`/notifications/mark-read/${notificationId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getNotificationsOfRecipient = async () => {
    try {
        const response = await api.get('/notifications/recipient');
        return response.data.notifications;
    }
    catch (error) {
        throw error;
    }
}

export const createNotification = async (notificationData) => {
    try {
        const response = await api.post('/notifications', notificationData);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}