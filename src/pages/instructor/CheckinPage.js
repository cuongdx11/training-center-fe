import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X, Clock } from 'lucide-react';
import {checkIn} from '../../services/attendanceService'

const CheckinPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkInStatus, setCheckInStatus] = useState({
    loading: true,
    success: false,
    message: ''
  });

  useEffect(() => {
    // Trích xuất sessionId từ URL
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

    // Thực hiện điểm danh
    const performCheckIn = async () => {
      try {
        // const response = await axios.post('/api/attendance/checkin', null, {
        //   params: { sessionId },
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}` // Giả sử bạn lưu token như này
        //   }
        // });
        const response = await checkIn(sessionId);

        setCheckInStatus({
          loading: false,
          success: true,
          message: response.data
        });
      } catch (error) {
        setCheckInStatus({
          loading: false,
          success: false,
          message: error.response?.data || 'Điểm danh thất bại'
        });
      }
    };

    performCheckIn();
  }, [location.search]);

  // Render loading state
  if (checkInStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Clock className="mx-auto mb-4 animate-spin text-blue-500" size={64} />
          <p className="text-xl text-gray-700">Đang xác thực điểm danh...</p>
        </div>
      </div>
    );
  }

  // Render kết quả điểm danh
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className={`
          py-4 px-6 flex items-center 
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
        
        <div className="p-6 text-center">
          <div className={`
            rounded-lg p-4 
            ${checkInStatus.success 
              ? 'bg-green-100 border-green-300 text-green-800' 
              : 'bg-red-100 border-red-300 text-red-800'
            }
          `}>
            <p className="text-lg font-semibold">{checkInStatus.message}</p>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => navigate('/')}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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