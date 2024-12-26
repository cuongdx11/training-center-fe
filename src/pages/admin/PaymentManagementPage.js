import React, { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import PaymentForm from '../../components/admin/payments/PaymentForm';
import PaymentTable from '../../components/admin/payments/PaymentTable';
import { paymentService } from '../../services/paymentService';
import { orderService } from '../../services/orderService';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentManagementPage = () => {
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [viewMode, setViewMode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    
    // Pagination state
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    
    // Filter states
    const [filters, setFilters] = useState({
        status: '',
        orderId: '',
        fromDate: '',
        toDate: '',
    });

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await paymentService.getFilteredPayments({
                page,
                size: pageSize,
                ...filters
            });
            setPayments(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            toast.error('Có lỗi xảy ra khi tải dữ liệu thanh toán');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [page, pageSize, filters]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const ordersResponse = await orderService.getOrders();
                setOrders(ordersResponse);

                const paymentMethodsResponse = await paymentService.getPaymentMethods();
                setPaymentMethods(paymentMethodsResponse);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
                toast.error('Có lỗi xảy ra khi tải dữ liệu ban đầu');
            }
        };

        fetchInitialData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(0); // Reset to first page when filters change
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value ? new Date(value).toISOString() : ''
        }));
        setPage(0);
    };

    const handleResetFilters = () => {
        setFilters({
            status: '',
            orderId: '',
            fromDate: '',
            toDate: '',
        });
        setPage(0);
    };

    const handleView = (payment) => {
        setSelectedPayment(payment);
        setViewMode('view');
    };

    const handleEdit = (payment) => {
        setSelectedPayment(payment);
        setViewMode('edit');
    };

    const handleDelete = async (payment) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này không?')) {
            try {
                await paymentService.deletePayment(payment.id);
                toast.success('Xóa giao dịch thành công');
                fetchPayments();
            } catch (error) {
                console.error('Failed to delete payment:', error);
                toast.error('Có lỗi xảy ra khi xóa giao dịch');
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedPayment) {
                await paymentService.updatePaymentStatus(selectedPayment.id, {
                    status: formData.status
                });
                toast.success('Cập nhật trạng thái thanh toán thành công');
                fetchPayments();
            }
            setViewMode(null);
            setSelectedPayment(null);
        } catch (error) {
            console.error('Failed to submit payment:', error);
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái thanh toán');
        }
    };

    const handleCloseForm = () => {
        setViewMode(null);
        setSelectedPayment(null);
    };
    
    const handleUpdateStatus = async (paymentId, isSuccess) => {
        try {
            await paymentService.updatePaymentStatus(paymentId, isSuccess);
            await fetchPayments();
            setViewMode(null);
            setSelectedPayment(null);
            toast.success(
                isSuccess 
                    ? 'Cập nhật trạng thái thanh toán thành công' 
                    : 'Đã đánh dấu thanh toán thất bại'
            );
        } catch (error) {
            console.error('Failed to update payment status:', error);
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái thanh toán');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Thanh Toán</h1>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Order ID Search */}
                    <div className="relative">
                        <input
                            type="text"
                            name="orderId"
                            value={filters.orderId}
                            onChange={handleFilterChange}
                            placeholder="Tìm theo mã đơn hàng"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ thanh toán</option>
                            <option value="COMPLETED">Đã thanh toán</option>
                            <option value="FAILED">Thất bại</option>
                        </select>
                    </div>

                    {/* Date Filters */}
                    <div className="relative">
                        <input
                            type="date"
                            name="fromDate"
                            value={filters.fromDate ? filters.fromDate.split('T')[0] : ''}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>

                    <div className="relative">
                        <input
                            type="date"
                            name="toDate"
                            value={filters.toDate ? filters.toDate.split('T')[0] : ''}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
                    >
                        Đặt lại bộ lọc
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    <PaymentTable 
                        payments={payments} 
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="px-3 py-2 border rounded-lg"
                        >
                             <option value={5}>5 mỗi trang</option>
                            <option value={10}>10 mỗi trang</option>
                            <option value={20}>20 mỗi trang</option>
                            <option value={50}>50 mỗi trang</option>
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                disabled={page === 0}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <span className="px-4 py-2">
                                Trang {page + 1} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={page === totalPages - 1}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Modal Forms */}
            {viewMode === 'view' && selectedPayment && (
                <PaymentForm 
                    payment={selectedPayment} 
                    onClose={handleCloseForm}
                    readOnly={true}
                />
            )}

            {viewMode === 'edit' && selectedPayment && (
                <PaymentForm 
                    payment={selectedPayment} 
                    onClose={handleCloseForm}
                    onUpdateStatus={handleUpdateStatus}
                    mode="edit"
                />
            )}
        </div>
    );
};

export default PaymentManagementPage;