import api from './api';


export const addLesson = async(lessonData,sectionId) => {
    try {
        const response = await api.post('/lessons',
            {
                ...lessonData,
                sectionId : sectionId

            }
        )
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

// Cập nhật bài học
export const updateLesson = async (lessonId, lessonData) => {
    try {
        const response = await api.put(`/lessons/${lessonId}`, lessonData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xóa bài học
export const deleteLesson = async (lessonId) => {
    try {
        await api.delete(`/lessons/${lessonId}`);
    } catch (error) {
        throw error;
    }
};

// Xóa bài học khỏi section
export const removeLessonFromSection = async (lessonId) => {
    try {
        await api.put(`/lessons/${lessonId}/remove-from-section`);
    } catch (error) {
        throw error;
    }
};