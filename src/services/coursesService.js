import axios from "./api";

export const getCourses = async () => {
  try {
    const response = await axios.get(`/courses`);
    return response.data.data.content;
  } catch (error) {
    throw error;
  }
};

// Lấy chi tiết một khóa học
export const getCourseById = async (courseId) => {
  try {
    const response = await axios.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCourseSchedule = (courseId) => {
  return axios.get(`/schedule/courses/${courseId}`);
};

export const addCourse = (courseData) => {
  return axios.post("/courses", courseData);
};

export const getCoursesByUser = (userId) => {
  return axios.get(`/courses/user/${userId}/enrollments`);
};

// Thêm hàm update course
export const updateCourse = (courseId, courseData) => {
  return axios.put(`/courses/${courseId}`, courseData);
};

// Thêm hàm xóa course (nếu cần)
export const deleteCourse = (courseId) => {
  return axios.delete(`/courses/${courseId}`);
};

export const getCourseByType = async (type) => {
  try {
    const response = await axios.get(
      `/courses?key=category.type&operation==&value=${type}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getCourseByUserRegister = async () => {
  try {
    const response = await axios.get("/courses/user");
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const searchCourse = async (searchQuery) => {
  try {
    const response = await axios.get(`/courses/search?q=${encodeURIComponent(searchQuery)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
