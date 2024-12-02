import React, { useState, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Clock, 
  CreditCard, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  BookOpen,
  Users,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { orderService } from '../services/orderService';

const StatusBadge = memo(({ status, getColorClass }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(status)}`}>
    {status || 'N/A'}
  </span>
));

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (error) {
        setError(error.message || 'Không thể tải chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const statusColors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderLoadingState = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
      </div>
    </div>
  );

  const renderErrorState = (message) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg max-w-md w-full">
        <div className="flex items-center">
          <AlertCircle className="h-8 w-8 text-red-400 mr-4" />
          <div>
            <h3 className="text-red-800 font-semibold text-lg">Lỗi</h3>
            <p className="text-red-700">{message}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/orders')} 
          className="mt-4 w-full bg-red-100 text-red-800 py-2 rounded hover:bg-red-200 transition"
        >
          Quay về danh sách đơn hàng
        </button>
      </div>
    </div>
  );

  if (loading) return renderLoadingState();
  if (error) return renderErrorState(error);
  if (!order) return renderErrorState('Không tìm thấy thông tin đơn hàng');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate('/orders')}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ChevronLeft className="mr-2" /> Quay lại danh sách đơn hàng
      </button>

      <div className="space-y-6">
        {/* Order Information Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 border-b px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng #{order.id?.substring(0, 8) || 'N/A'}</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="space-y-4 bg-gray-100 p-5 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Thông tin khách hàng</h3>
                <div className="space-y-3">
                  {[
                    { icon: User, text: order.user?.fullName },
                    { icon: Mail, text: order.user?.email },
                    { icon: Phone, text: order.user?.phoneNumber },
                    { icon: MapPin, text: order.user?.address }
                  ].map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">{text || 'Không có thông tin'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Information */}
              <div className="space-y-4 bg-gray-100 p-5 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Thông tin đơn hàng</h3>
                <div className="space-y-3">
                  {[
                    { 
                      icon: Clock, 
                      label: 'Trạng thái đơn hàng', 
                      value: <StatusBadge status={order.status} getColorClass={getStatusColor} /> 
                    },
                    { 
                      icon: CreditCard, 
                      label: 'Trạng thái thanh toán', 
                      value: <StatusBadge status={order.paymentStatus} getColorClass={getPaymentStatusColor} /> 
                    },
                    { 
                      icon: DollarSign, 
                      label: 'Tổng tiền', 
                      value: `${(order.totalAmount || 0).toLocaleString()} VND` 
                    },
                    { 
                      icon: Calendar, 
                      label: 'Ngày đặt', 
                      value: formatDate(order.createdAt) 
                    }
                  ].map(({ icon: Icon, label, value }, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="text-gray-600 mr-2">{label}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Courses */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 border-b px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">Danh sách khóa học</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {order.orderItems?.map((item) => (
                <div 
                  key={item.id} 
                  className="border-2 border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-xl text-gray-800 mb-2">{item.course?.title || 'N/A'}</h4>
                      <div className="flex space-x-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          <span>{item.course?.duration || 0} giờ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          <span>{item.course?.studentCount || 0} học viên</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-blue-600">{(item.price || 0).toLocaleString()} VND</span>
                      <span className="text-sm text-gray-500">{item.course?.category?.name || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {order.notes && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-800">Ghi chú</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 italic">{order.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(OrderDetail);