// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api/', // Thay thế bằng URL của API bạn sử dụng
//   withCredentials: true
// });



// api.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem('accessToken'); // Lấy token từ localStorage
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`; // Thêm token vào header
//       console.log(accessToken);
//     }
//     return config; // Trả về config đã cập nhật
//   },
//   (error) => {
//     return Promise.reject(error); // Xử lý lỗi trong request nếu có
//   }
// );
// export default api;

import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// Tạo instance của axios
const createAPIInstance = () => {
  const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
    withCredentials: true
  });

  // Thêm interceptor cho requests
  api.interceptors.request.use(
    (config) => {
      // Lấy user từ context thông qua closure
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData?.accessToken) {
        config.headers.Authorization = `Bearer ${userData.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Thêm interceptor cho responses để handle refresh token nếu cần
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Nếu token hết hạn và chưa thử refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Lấy user data từ localStorage
          const userData = JSON.parse(localStorage.getItem('user'));
          
          if (userData?.refreshToken) {
            // Gọi API refresh token
            const response = await axios.post('http://localhost:8080/api/auth/refresh-token', {
              refreshToken: userData.refreshToken
            });

            // Cập nhật token mới vào userData
            const newUserData = {
              ...userData,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken
            };

            // Lưu user data mới vào localStorage
            localStorage.setItem('user', JSON.stringify(newUserData));

            // Cập nhật token trong header của request ban đầu
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

            // Thử lại request ban đầu
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Nếu refresh token thất bại, logout user
          const event = new Event('unauthorized');
          window.dispatchEvent(event);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// Export instance của API
const api = createAPIInstance();
export default api;