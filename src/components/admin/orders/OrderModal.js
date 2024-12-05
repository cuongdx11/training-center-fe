import React from 'react';
import { X, Calendar, User, CreditCard, ShoppingCart, Tag } from 'lucide-react';

const OrderModal = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-0 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Order Overview */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Tag className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                <p className="font-semibold text-gray-800">{order.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-semibold text-gray-800">{order.user.fullName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Ngày đặt</p>
                <p className="font-semibold text-gray-800">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Tổng thanh toán</p>
                <p className="font-bold text-xl text-blue-700">
                  {order.totalAmount.toLocaleString()} VND
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <span 
                  className={`
                    inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${getStatusColor(order.status)}
                  `}
                >
                  {order.status === 'PENDING' ? 'Chờ xử lý' : 
                   order.status === 'COMPLETED' ? 'Hoàn thành' : 
                   order.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 pt-0">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Chi tiết khóa học</h3>
          <div className="space-y-4">
            {order.orderItems.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {item.course.thumbnail && (
                  <img 
                    src={item.course.thumbnail} 
                    alt={item.course.title} 
                    className="w-16 h-16 rounded-md mr-4 object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.course.title}</p>
                  <p className="text-sm text-gray-500">{item.course.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-700">
                    {item.price.toLocaleString()} VND
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 text-center">
          <button 
            onClick={onClose} 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;