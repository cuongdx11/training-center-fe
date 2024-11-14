import axios from './api';

export const getCourseSchedule = (courseId) => {
    return axios.get(`/schedule/courses/${courseId}`);
}

export const getAllSchedule = () => {
    return axios.get(`/schedule`);
}