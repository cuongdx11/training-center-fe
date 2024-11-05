import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { orderService } from '../services/orderService';

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
        setError(error.message || 'Failed to fetch order details');
        console.error('Error fetching order details:', error);
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-400" />
            <p className="ml-3 text-blue-700">Không tìm thấy thông tin đơn hàng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/orders')}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Quay lại danh sách đơn hàng
      </button>

      <div className="space-y-6">
        {/* Order Information Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Chi tiết đơn hàng #{order.id?.substring(0, 8) || 'N/A'}</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Thông tin khách hàng</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{order.user?.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{order.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{order.user?.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{order.user?.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Thông tin đơn hàng</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Trạng thái đơn hàng: </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span>Trạng thái thanh toán: </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus || 'N/A'}
                    </span>
                  </div>
                  {order.paymentMethod && (
                    <div className="flex items-center gap-2">
                      {order.paymentMethod.logoUrl && (
                        <img 
                          src={order.paymentMethod.logoUrl} 
                          alt={order.paymentMethod.name || 'Payment method'}
                          className="w-4 h-4"
                        />
                      )}
                      <span>{order.paymentMethod.name || 'N/A'}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>Tổng tiền: ${(order.totalAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Ngày đặt: {formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Courses */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Danh sách khóa học</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-lg">{item.course?.title || 'N/A'}</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="w-4 h-4" />
                          <span>Thời lượng: {item.course?.duration || 0} giờ</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>Số học viên: {item.course?.studentCount || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-end">
                      <span className="text-xl font-semibold">${(item.price || 0).toLocaleString()}</span>
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-semibold">Ghi chú</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700">{order.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;