import React, { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  CreditCard, 
  DollarSign,  
  Package,
  Filter,
  Search
} from 'lucide-react';
import { orderService } from '../services/orderService';

const StatusBadge = memo(({ status }) => {
  const statusConfig = {
    PENDING: {
      color: 'bg-amber-100 text-amber-800 border border-amber-200',
      label: 'Đang xử lý'
    },
    COMPLETED: {
      color: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      label: 'Hoàn thành'
    },
    CANCELLED: {
      color: 'bg-rose-100 text-rose-800 border border-rose-200',
      label: 'Đã hủy'
    }
  };

  const config = statusConfig[status] || {
    color: 'bg-gray-100 text-gray-800 border border-gray-200',
    label: status
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {config.label}
    </span>
  );
});

const OrderCard = memo(({ order, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer border border-gray-100 hover:border-blue-100"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Đơn hàng #{order.id.substring(0, 8)}
            </h3>
            <StatusBadge status={order.status} />
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-xl font-bold text-blue-600 mb-1">
              <DollarSign className="w-5 h-5" />
              {order.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{order.paymentMethod?.name || 'Không xác định'}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    if (filter !== 'ALL') {
      result = result.filter(order => order.status === filter);
    }
    
    if (searchTerm) {
      result = result.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  }, [orders, filter, searchTerm]);

  const renderLoadingState = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 animate-pulse">Đang tải danh sách đơn hàng...</p>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl">
      <Package className="w-16 h-16 text-gray-400 mb-6" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">Chưa có đơn hàng</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Bạn chưa có đơn hàng nào. Hãy khám phá các khóa học hấp dẫn của chúng tôi!
      </p>
      <button 
        onClick={() => navigate('/courses')}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Khám phá khóa học
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter className="text-gray-500" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-auto border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Tất cả đơn hàng</option>
              <option value="PENDING">Đang xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? renderLoadingState() : (
        filteredOrders.length === 0 ? renderEmptyState() : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => navigate(`/orders/${order.id}`)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default React.memo(OrderList);