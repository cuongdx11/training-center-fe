import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../services/coursesService';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';

const CheckoutFlashPage = () => {
  const { id } = useParams();
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
        const courseResponse = await getCourseById(id);
        setCourse(courseResponse.data);

        const paymentMethodsResponse = await paymentService.getPaymentMethods();
        setPaymentMethods(paymentMethodsResponse);
        if (paymentMethodsResponse.length > 0) {
          setSelectedPaymentMethod(paymentMethodsResponse[0].id);
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
      const response = await orderService.checkoutNow(selectedPaymentMethod, course.id);
      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        throw new Error('Không nhận được URL thanh toán');
      }
      alert(`Bạn đã thanh toán khóa học: ${course.title}`);
      navigate('/');
    } catch (error) {
      setError('Lỗi khi xử lý thanh toán. Vui lòng thử lại.');
      console.error('Lỗi thanh toán:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-6 border-l-4 border-red-500">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Có lỗi xảy ra</h3>
              <p className="mt-1 text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with premium look */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất đăng ký khóa học của bạn</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-gray-100">
          {/* Course Information Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
                <p className="text-blue-100 max-w-xl">{course.description}</p>
              </div>
              <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                <span className="text-3xl font-bold text-white">{formatPrice(course.price)}</span>
              </div>
            </div>
          </div>

          {/* Course Features */}
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">Truy cập trọn đời</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">Chứng chỉ hoàn thành</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-gray-600">Cập nhật liên tục</p>
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="px-8 py-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Chọn phương thức thanh toán</h3>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300
                    ${selectedPaymentMethod === method.id 
                      ? 'bg-blue-50 border-2 border-blue-500 shadow-md' 
                      : 'border-2 border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => setSelectedPaymentMethod(method.id)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-4">
                    <span className="text-lg font-medium text-gray-900">{method.name}</span>
                    {selectedPaymentMethod === method.id && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Checkout Button Section */}
          <div className="px-8 py-6 bg-gray-50">
            <button
              onClick={handleCheckout}
              disabled={loading || !selectedPaymentMethod}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform
                ${loading || !selectedPaymentMethod
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý thanh toán...</span>
                </div>
              ) : (
                'Xác nhận thanh toán'
              )}
            </button>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center text-gray-500 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Thanh toán an toàn & bảo mật
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlashPage;