import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ClassDetail from '../components/class/ClassDetail';
import userService from '../services/userService';

const ClassDetailPage = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar 
        userName={userInfo.fullName} 
        userImage={userInfo.profilePicture || '/path/to/default/avatar.jpg'}
      />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg">
          <ClassDetail classId={id} />
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;