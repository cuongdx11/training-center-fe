import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { orderService } from '../../../services/orderService';
import { paymentService } from '../../../services/paymentService';
import userService from '../../../services/userService';
import { getAllCourses } from '../../../services/coursesService';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentQRModal from '../../../components/admin/payments/PaymentQRModal'

const CreateOrderPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        paymentMethodId: '',
        items: [{ courseId: '', price: 0 }],
        notes: ''
    });

    // State for dropdown data
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0); // Tổng giá tiền
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrPaymentInfo, setQrPaymentInfo] = useState({
      amount: 0,
      orderCode: ''
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const paymentMethodsResponse = await paymentService.getPaymentMethods();
                setPaymentMethods(paymentMethodsResponse);

                const usersResponse = await userService.getStudents();
                setUsers(usersResponse);

                const coursesResponse = await getAllCourses();
                setCourses(coursesResponse);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            }
        };

        fetchInitialData();
    }, []);

    // Update total amount when items change
    useEffect(() => {
        const total = formData.items.reduce((sum, item) => sum + (item.price || 0), 0);
        setTotalAmount(total);
    }, [formData.items]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];

        if (name === 'courseId') {
            const selectedCourse = courses.find((course) => course.id === value);
            newItems[index] = {
                courseId: value,
                price: selectedCourse ? selectedCourse.price : 0
            };
        }

        setFormData((prev) => ({
            ...prev,
            items: newItems
        }));
    };

    const addOrderItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, { courseId: '', price: 0 }]
        }));
    };

    const removeOrderItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            items: newItems
        }));
    };
    const handleCloseQRModal = () => {
        setShowQRModal(false);
        setQrPaymentInfo(null);
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newOrder = await orderService.createOrder(formData);
            
            switch (newOrder.paymentMethodCode) {
              case 'VNPAY':
                if (newOrder?.paymentUrl) {
                  toast.success('Đơn hàng đã được tạo thành công! Đang chuyển hướng đến trang thanh toán...');
                  window.location.href = newOrder.paymentUrl;
                } else {
                  throw new Error('Missing payment URL for VNPAY payment');
                }
                break;
          
              case 'QRCODE':
                setQrPaymentInfo({
                  amount: newOrder.order.totalAmount,
                  orderCode: newOrder.order.id || `ORDER_${Date.now()}`
                });
                toast.success('Đơn hàng đã được tạo thành công!');
                setShowQRModal(true);
                break;
          
              case 'TTTT':
                toast.success('Đơn hàng đã được tạo thành công! Vui lòng đến cơ sở để thanh toán trực tiếp');
                navigate('/admin/orders');
                break;
          
              default:
                toast.success('Bạn đã tạo và thanh toán thành công đơn hàng!');
                navigate('/admin/orders');
            }
          } catch (error) {
            console.error('Failed to create order:', error);
            
            if (error.response) {
              switch (error.response.status) {
                case 403:
                  toast.error(error.response.data.message || 'Một số khóa học đã được đăng ký trước đó.');
                  break;
                case 400:
                  toast.error('Dữ liệu đơn hàng không hợp lệ. Vui lòng kiểm tra lại.');
                  break;
                case 401:
                  toast.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
                  // Có thể thêm xử lý logout hoặc refresh token ở đây
                  break;
                default:
                  toast.error('Đã xảy ra lỗi trong quá trình tạo đơn hàng. Vui lòng thử lại sau.');
              }
            } else if (error.request) {
              toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
            } else {
              toast.error('Đã xảy ra lỗi trong quá trình tạo đơn hàng. Vui lòng thử lại sau.');
            }
          } finally {
            setIsLoading(false);
          }
    };

    return (
        <div className="container mx-auto p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Tạo đơn hàng mới</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Khách hàng</label>
                            <select
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            >
                                <option value="">Chọn khách hàng</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phương thức thanh toán</label>
                            <select
                                name="paymentMethodId"
                                value={formData.paymentMethodId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            >
                                <option value="">Chọn phương thức thanh toán</option>
                                {paymentMethods.map((method) => (
                                    <option key={method.id} value={method.id}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-semibold text-gray-700">Khóa học</label>
                            <button
                                type="button"
                                onClick={addOrderItem}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition duration-200"
                            >
                                Thêm khóa học
                            </button>
                        </div>
                        {formData.items.map((item, index) => (
                            <div key={index} className="grid md:grid-cols-3 gap-4 mb-4 items-center">
                                <select
                                    name="courseId"
                                    value={item.courseId}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                >
                                    <option value="">Chọn khóa học</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    name="price"
                                    value={item.price}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none transition duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeOrderItem(index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                                    disabled={formData.items.length === 1}
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="text-right font-semibold text-lg">
                        Tổng tiền: <span className="text-green-500">{totalAmount.toLocaleString()} VNĐ</span>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            rows="4"
                            placeholder="Ghi chú cho đơn hàng..."
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200 disabled:bg-gray-400"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Tạo đơn hàng'}
                        </button>
                    </div>
                </form>
            </div>
            {/* QR Payment Modal */}
       {showQRModal && qrPaymentInfo && (
        <PaymentQRModal
          isOpen={showQRModal}
          onClose={handleCloseQRModal}
          amount={qrPaymentInfo.amount}
          orderCode={qrPaymentInfo.orderCode}
        />
      )}
        </div>
    );
};

export default CreateOrderPage;
