import api from './api';



export const createReview = async (data) => {
    try {
        const response = await api.post('/review',data);
        return response.data;
    }
    catch (error) {
        throw error;
    }

}

export const listReviewByCourse = async (courseId) => {
    try {
        const response = await api.get(`/review/courses/${courseId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}