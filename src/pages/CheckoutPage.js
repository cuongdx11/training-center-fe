import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import cartService from '../services/cartService';
import { paymentService } from '../services/paymentService';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const { user } = useAuth();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData.id;
    try {
      const [cartData, paymentMethodsData] = await Promise.all([
        cartService.getCart(userId),
        paymentService.getPaymentMethods()
      ]);
      
      setCart(cartData);
      setPaymentMethods(paymentMethodsData);
      if (paymentMethodsData.length > 0) {
        setSelectedPaymentMethod(paymentMethodsData[0].id);
      }
    } catch (error) {
      setError('Failed to load checkout information');
      console.error('Checkout loading error:', error);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await orderService.checkout(selectedPaymentMethod);
      navigate(`/orders/${response.order.id}`);
    } catch (error) {
      setError('Failed to process checkout. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.cartItems?.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.course.title}</h3>
                    <p className="text-sm text-gray-500">{item.course.instructor}</p>
                  </div>
                  <p className="font-medium">${item.price}</p>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center font-bold">
                  <span>Total Amount</span>
                  <span>${cart.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">{method.name}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || !selectedPaymentMethod}
              className={`w-full mt-6 px-4 py-2 rounded-md text-white font-medium
                ${loading || !selectedPaymentMethod 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing
                </div>
              ) : (
                `Pay $${cart.totalAmount}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;