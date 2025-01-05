import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const PaymentQRModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  orderCode
}) => {
  const navigate = useNavigate();
  
  // Thông tin ngân hàng mặc định
  const bankInfo = {
    bankId: '970422', 
    bankName: 'MB Bank',
    accountNumber: '0384709215', 
    accountName: 'DINH XUAN CUONG' 
  };
  
  // Generate VietQR URL
  const generateVietQRUrl = (amount, orderCode) => {
    const baseUrl = 'https://api.vietqr.io/image';
    const params = new URLSearchParams({
      amount: amount,
      addInfo: orderCode,
      accountName: bankInfo.accountName,
    });
    return `${baseUrl}/${bankInfo.bankId}-${bankInfo.accountNumber}-x2Akvj.jpg?${params.toString()}`;
  };

  const handlePaymentConfirmation = () => {
    Swal.fire({
      title: 'Đang xử lý',
      text: 'Vui lòng đợi hệ thống kiểm tra giao dịch và thông báo khi check xong',
      icon: 'info',
      confirmButtonText: 'OK',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/admin/orders'); // Điều hướng về trang đơn hàng
      }
    });
  };

  const handleClose = () => {
    onClose();
    navigate('/admin/orders'); // Điều hướng về trang đơn hàng khi đóng
  };

  const qrUrl = generateVietQRUrl(amount, orderCode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Thanh toán chuyển khoản</h3>
            <p className="text-gray-600 mt-2">Quét mã QR để thanh toán</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <img 
              src={qrUrl}
              alt="Payment QR Code"
              className="w-64 h-64 border rounded-xl"
            />
          </div>

          {/* Payment Details */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Số tài khoản:</span>
                <span className="font-semibold">{bankInfo.accountNumber}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tên tài khoản:</span>
                <span className="font-semibold">{bankInfo.accountName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-semibold">{bankInfo.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-semibold text-blue-600">{amount.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">Nội dung CK:</span>
                <span className="font-semibold">{orderCode}</span>
              </div>
            </div>
          </div>

          {/* Payment Confirmation Button */}
          <button
            onClick={handlePaymentConfirmation}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200 mb-3"
          >
            Đã chuyển khoản
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors duration-200"
          >
            Đóng
          </button>

          {/* Close Icon Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Đóng modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRModal;