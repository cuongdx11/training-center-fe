import api from './api';

// Lấy tất cả các topic
export const getTopics = async () => {
    try {
        const response = await api.get('/course-topic/topics');
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Lấy thông tin một topic theo ID
export const getTopic = async (id) => {
    try {
        const response = await api.get(`/course-topic/topic/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Thêm một topic mới
export const addTopic = async (topicRequest) => {
    try {
        const response = await api.post('/course-topic/topic', topicRequest);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Cập nhật thông tin topic
export const updateTopic = async (id, topicRequest) => {
    try {
        const response = await api.put(`/course-topic/topic/${id}`, topicRequest);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Xóa topic
export const deleteTopic = async (id) => {
    try {
        const response = await api.delete(`/course-topic/topic/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Thêm khóa học vào topic
export const addCourseToTopic = async (topicId, courseId) => {
    try {
        const response = await api.post('/course-topic/add-course', null, {
            params: { topicId, courseId }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Xóa khóa học khỏi topic
export const removeCourseFromTopic = async (topicId, courseId) => {
    try {
        const response = await api.delete('/course-topic/remove-course', {
            params: { topicId, courseId }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getCoursesOfTopic = async (topicId) => {
    try {
        const response = await api.get(`/course-topic/courses/${topicId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getAllTopics = async () => {
    try {
        const response = await api.get(`/topics`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
