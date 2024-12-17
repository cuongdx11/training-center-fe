import axios from './api';

export const getCourseSchedule = (courseId) => {
    return axios.get(`/schedule/courses/${courseId}`);
}

export const getAllSchedule = () => {
    return axios.get(`/schedule`);
}



export const addRecurringSchedule = async(data) => {
    try {
        const response = await axios.post(`/schedule/recurring`, data);
        return response;
    }
    catch (error){
        throw error;
    }
}

export const getScheduleByUser = async() => {
    try {
        const response = await axios.get(`/schedule/user`);
        return response.data;
    }
    catch(error){ 
        throw error;
    }
}

export const getScheduleByInstructor = async () => {
    try {
        const response = await axios.get(`/schedule/instructor`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

