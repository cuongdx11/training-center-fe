import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X, Clock } from 'lucide-react';
import { checkIn } from '../../services/attendanceService';

const CheckinPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkInStatus, setCheckInStatus] = useState({
    loading: true,
    success: false,
    message: ''
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      setCheckInStatus({
        loading: false,
        success: false,
        message: 'Không tìm thấy mã phiên điểm danh'
      });
      return;
    }

    const performCheckIn = async () => {
      try {
        await checkIn(sessionId);
        setCheckInStatus({
          loading: false,
          success: true,
          message: 'Điểm danh thành công'
        });
      } catch (error) {
        let errorMessage = 'Điểm danh thất bại';
        
        // Handle specific error cases from backend
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message?.includes('AttendanceSession Not Found')) {
          errorMessage = 'Không tìm thấy phiên điểm danh';
        } else if (error.message?.includes('User Not Found')) {
          errorMessage = 'Không tìm thấy thông tin sinh viên';
        } else if (error.message?.includes('CourseClass Not Found')) {
          errorMessage = 'Không tìm thấy thông tin lớp học';
        } else if (error.message?.includes('Phiên điểm danh đã hết hạn')) {
          errorMessage = 'Phiên điểm danh đã hết hạn';
        } else if (error.message?.includes('Bạn đã điểm danh rồi')) {
          errorMessage = 'Bạn đã điểm danh cho phiên này rồi';
        }

        setCheckInStatus({
          loading: false,
          success: false,
          message: errorMessage
        });
      }
    };

    performCheckIn();
  }, [location.search]);

  if (checkInStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="mx-auto mb-4 animate-spin text-blue-500" size={64} />
          <p className="text-xl text-gray-700">Đang xử lý điểm danh...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className={`
          py-4 px-6 flex items-center justify-center
          ${checkInStatus.success ? 'bg-green-600' : 'bg-red-600'} 
          text-white
        `}>
          {checkInStatus.success ? (
            <Check className="mr-2" size={24} />
          ) : (
            <X className="mr-2" size={24} />
          )}
          <h2 className="text-xl font-bold">
            {checkInStatus.success ? 'Điểm Danh Thành Công' : 'Điểm Danh Thất Bại'}
          </h2>
        </div>
        
        <div className="p-6">
          <div className={`
            rounded-lg p-4 text-center
            ${checkInStatus.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
            }
          `}>
            <p className="text-lg font-medium">{checkInStatus.message}</p>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Quay Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckinPage;