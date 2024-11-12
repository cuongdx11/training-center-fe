import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import OrderList from '../components/OrderList';
import userService from '../services/userService';

const OrdersPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData.id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getUserById(userId);
        setUserInfo(userData);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar 
        userName={userInfo.fullName} 
        userImage={userInfo.profilePicture || '/path/to/default/avatar.jpg'} // Avatar mặc định nếu không có ảnh
      />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Đơn hàng của tôi</h2>
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
