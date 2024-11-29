import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const AttendanceQRPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { qrCodeUrl, className, duration } = location.state || {};

  // Nếu không có thông tin QR, quay lại trang chính
  if (!qrCodeUrl) {
    navigate('/create-attendance');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 text-white py-4 px-6 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <Check className="mr-2" size={24} /> Phiên Điểm Danh
          </h2>
          <button 
            onClick={() => navigate('/create-attendance')} 
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded"
          >
            Quay Lại
          </button>
        </div>
        
        <div className="p-6 text-center">
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Lớp: {className}</p>
            <p className="text-gray-600">Thời gian: {duration} phút</p>
          </div>

          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeUrl)}`} 
            alt="Mã QR Điểm Danh" 
            className="mx-auto mb-4 shadow-lg rounded-lg border-4 border-blue-200"
          />
          <p className="text-gray-600 mb-4">
            Quét mã QR để điểm danh
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceQRPage;