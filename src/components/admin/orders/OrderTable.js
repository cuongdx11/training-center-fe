import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const OrderTable = ({ orders, onView, onEdit, onDelete }) => {
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
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chi tiết đơn hàng
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Khóa học
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thanh toán
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => {
            const course = order.orderItems[0]?.course;
            return (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      Mã đơn: {order.id.slice(0, 8)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {order.user.fullName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    {course?.thumbnail && (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-12 h-12 rounded-md mr-3 object-cover"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {course?.title || 'Không có thông tin khóa học'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {course?.level || 'Chưa xác định'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {order.totalAmount.toLocaleString()} VND
                    </span>
                    <span className="text-sm text-gray-500">
                      {order.paymentMethod?.name || 'Chưa chọn'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span 
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${getStatusColor(order.status)}
                    `}
                  >
                    {order.status === 'PENDING' ? 'Chờ xử lý' : 
                     order.status === 'COMPLETED' ? 'Hoàn thành' : 
                     order.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button 
                      onClick={() => onView(order)} 
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onEdit(order)} 
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(order)} 
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Xóa đơn hàng"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;