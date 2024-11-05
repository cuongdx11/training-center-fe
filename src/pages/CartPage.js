import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cartService from '../services/cartService';
import { MinusCircle, PlusCircle } from 'lucide-react';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart(user.id);
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (courseId, newQuantity) => {
    try {
      if (newQuantity > 0) {
        await cartService.addToCart(user.id, courseId, newQuantity);
        await loadCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Khám phá khóa học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Danh sách khóa học */}
        <div className="lg:col-span-2 space-y-4">
          {cart.cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.course.thumbnail || "/api/placeholder/120/80"}
                  alt={item.course.title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{item.course.title}</h3>
                  <p className="text-blue-600 font-semibold">
                    {Number(item.price).toLocaleString('vi-VN')}đ
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleUpdateQuantity(item.course.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={() => handleUpdateQuantity(item.course.id, item.quantity + 1)}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tóm tắt đơn hàng */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{Number(cart.totalAmount).toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Tổng cộng</span>
                <span className="text-blue-600">{Number(cart.totalAmount).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={handleCheckout}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;