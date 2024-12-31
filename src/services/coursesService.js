import axios from "./api";

export const getCourses = async (
  page = 0,
  size = 6,
  sortBy = 'title',
  sortDirection = 'asc',
  keys = [],
  operations = [],
  values = []
) => {
  try {
    const params = {
      page,
      size,
      sortBy,
      sortDirection,
    };

    // Chỉ thêm các tham số filter nếu có
    if (keys.length > 0 && operations.length > 0 && values.length > 0) {
      params.keys = keys.join(',');
      params.operations = operations.join(',');
      params.values = values.join(',');
    }

    const response = await axios.get(`/courses`, { params });
    return response.data.data; // Trả về toàn bộ dữ liệu để xử lý linh hoạt
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error fetching courses');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error setting up the request');
    }
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

export const getAllCourses = async () => {
  try {
    const response = await axios.get(`/courses/all`);
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
      `/courses?keys=category.type&operations==&values=${type}`
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
