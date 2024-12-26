import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import OrderTable from '../../components/admin/orders/OrderTable';
import OrderForm from '../../components/admin/orders/OrderForm';
import OrderModal from '../../components/admin/orders/OrderModal';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import userService from '../../services/userService';
import { getAllCourses } from '../../services/coursesService';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [filters, setFilters] = useState({
    customerName: '',
    orderCode: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAllOrders({
        ...filters,
        page,
        size: pageSize
      });
      setOrders(response);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, filters]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [paymentMethodsRes, usersRes, coursesRes] = await Promise.all([
          paymentService.getPaymentMethods(),
          userService.getAllUsers(),
          getAllCourses()
        ]);
        setPaymentMethods(paymentMethodsRes);
        setUsers(usersRes);
        setCourses(coursesRes);
      } catch (error) {
        console.error('Failed to fetch form data:', error);
      }
    };
    fetchFormData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setPage(0);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleDelete = async (order) => {
    try {
      await orderService.deleteOrder(order.id);
      fetchOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[160px]">
            <div className="relative">
              <input
                type="text"
                name="customerName"
                placeholder="Tên khách hàng"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.customerName}
                onChange={handleFilterChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="flex-1 min-w-[160px]">
            <input
              type="text"
              name="orderCode"
              placeholder="Mã đơn hàng"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.orderCode}
              onChange={handleFilterChange}
            />
          </div>

          <div className="w-[150px]">
            <select
              name="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div className="w-[170px]">
            <input
              type="date"
              name="startDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="w-[170px]">
            <input
              type="date"
              name="endDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <OrderTable 
        orders={orders.content}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <div className="mt-4 flex justify-between items-center">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={5}>5 mỗi trang</option>
          <option value={10}>10 mỗi trang</option>
          <option value={20}>20 mỗi trang</option>
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          <span>Trang {page + 1} / {orders.totalPages}</span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, orders.totalPages - 1))}
            disabled={page === orders.totalPages - 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {isModalOpen && (
        <OrderModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
        />
      )}

      {isFormOpen && (
        <OrderForm 
          initialData={selectedOrder}
          onSubmit={async (formData) => {
            try {
              if (selectedOrder) {
                await orderService.updateOrder(selectedOrder.id, formData);
              } else {
                await orderService.createOrder(formData);
              }
              setIsFormOpen(false);
              setSelectedOrder(null);
              fetchOrders();
            } catch (error) {
              console.error('Failed to submit order:', error);
            }
          }}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedOrder(null);
          }}
          paymentMethods={paymentMethods}
          users={users}
          courses={courses}
        />
      )}
    </div>
  );
};

export default OrderManagementPage;