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