import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../services/coursesService'; // Giả sử bạn có một service để lấy thông tin khóa học
import { orderService } from '../services/orderService'; // Thêm order service để xử lý thanh toán
import { paymentService } from '../services/paymentService'; // Dịch vụ để lấy thông tin phương thức thanh toán

const CheckoutFlashPage = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [course, setCourse] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const courseResponse = await getCourseById(id); // Lấy thông tin khóa học
        setCourse(courseResponse.data);

        const paymentMethodsResponse = await paymentService.getPaymentMethods(); // Lấy danh sách phương thức thanh toán
        setPaymentMethods(paymentMethodsResponse);
        if (paymentMethodsResponse.length > 0) {
          setSelectedPaymentMethod(paymentMethodsResponse[0].id); // Chọn phương thức thanh toán đầu tiên mặc định
        }
      } catch (error) {
        setError('Lỗi khi lấy thông tin.');
        console.error("Lỗi khi lấy thông tin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = await orderService.checkout(selectedPaymentMethod, course.id); // Gọi API thanh toán
      alert(`Bạn đã thanh toán khóa học: ${course.title}`);
      navigate('/'); // Quay về trang chủ hoặc trang khác sau khi thanh toán
    } catch (error) {
      setError('Lỗi khi xử lý thanh toán. Vui lòng thử lại.');
      console.error('Lỗi thanh toán:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (!course) {
    return <div>Đang tải khóa học...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Thanh toán khóa học</h2>
          <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="text-2xl font-bold text-blue-600 mb-4">{formatPrice(course.price)}</div>

          {/* Phần chọn phương thức thanh toán */}
          <h3 className="text-lg font-semibold mb-4">Chọn phương thức thanh toán</h3>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => setSelectedPaymentMethod(method.id)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">{method.name}</span>
              </label>
            ))}
          </div>

          <button 
            onClick={handleCheckout} 
            disabled={loading || !selectedPaymentMethod}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 
              ${loading || !selectedPaymentMethod 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </div>
            ) : (
              'Xác nhận thanh toán'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlashPage;
