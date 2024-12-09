import React from 'react';
import { X } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF'; // Import the PDF component

const PaymentForm = ({ payment, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-full p-2 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">HÓA ĐƠN THANH TOÁN</h2>
            <p className="text-gray-600">Mã giao dịch: {payment.transactionCode}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Thông tin khách hàng</h3>
              <div className="space-y-2">
                <p><span className="text-gray-600">Họ tên:</span> {payment.order.user.fullName}</p>
                <p><span className="text-gray-600">Email:</span> {payment.order.user.email}</p>
                <p><span className="text-gray-600">Số điện thoại:</span> {payment.order.user.phoneNumber}</p>
                <p><span className="text-gray-600">Địa chỉ:</span> {payment.order.user.address}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Thông tin thanh toán</h3>
              <div className="space-y-2">
                <p><span className="text-gray-600">Phương thức:</span> {payment.paymentMethod.name}</p>
                <p><span className="text-gray-600">Trạng thái:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                    payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status === 'COMPLETED' ? 'Đã thanh toán' :
                     payment.status === 'PENDING' ? 'Chờ thanh toán' : 'Thất bại'}
                  </span>
                </p>
                <p><span className="text-gray-600">Ngày tạo:</span> {formatDate(payment.createdAt)}</p>
                {payment.completedAt && (
                  <p><span className="text-gray-600">Ngày hoàn thành:</span> {formatDate(payment.completedAt)}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Chi tiết khóa học</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Khóa học</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Giảng viên</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Giá tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {payment.order.orderItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{item.course.title}</p>
                          <p className="text-sm text-gray-500">{item.course.category.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {item.course.instructors.map(instructor => instructor.fullName).join(', ')}
                      </td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr className="border-t">
                    <td colSpan="2" className="px-4 py-3 text-right font-semibold">Tổng cộng:</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(payment.amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <PDFDownloadLink 
              document={<InvoicePDF payment={payment} />} 
              fileName={`hoa-don-${payment.transactionCode}.pdf`}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {({ loading }) => (loading ? 'Đang tạo PDF...' : 'Xuất hóa đơn PDF')}
            </PDFDownloadLink>
            
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;