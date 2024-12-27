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

export const deleteReview = async (id) => {
    try {
        const response = await api.delete(`/review/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export const getAll = async (courseId, rating, keyword, page = 0, size = 5) => {
    try {
        const response = await api.get('/review', {
            params: {
                courseId,  
                rating,   
                keyword,  
                page,    
                size     
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
