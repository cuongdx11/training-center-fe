import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { changePass } from '../services/authService';
import userService from '../services/userService';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const data = await userService.getProfileUser();
      setUserInfo(data);
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra khi tải thông tin người dùng');
      toast.error('Không thể tải thông tin người dùng');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      Swal.fire('Lỗi', 'Vui lòng điền đầy đủ thông tin', 'error');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire('Lỗi', 'Mật khẩu mới không khớp', 'error');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      Swal.fire('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
      setLoading(false);
      return;
    }

    try {
      await changePass(formData);
      Swal.fire('Thành công', 'Đổi mật khẩu thành công', 'success');
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      Swal.fire('Lỗi', err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold text-xl mb-2">Đã xảy ra lỗi</h3>
          <p className="mb-4">{error}</p>
          <button 
            onClick={fetchUserInfo}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500 bg-white p-6 rounded-lg shadow-lg">
          Không tìm thấy thông tin người dùng
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        userName={userInfo.fullName} 
        userImage={userInfo.profilePicture} 
      />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Đổi mật khẩu
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  id="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;