import React, { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import UserCalendar from "../components/user/UserCalendar";
import { getScheduleByUser } from "../services/scheduleService";
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const UserCalendarPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.id) return;
      
      try {
        const data = await userService.getProfileUser();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await getScheduleByUser();
        setSchedules(data); 
      } catch (err) {
        setError("Có lỗi xảy ra khi tải lịch học.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchSchedules();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* <div className="hidden md:block"> */}
        <Sidebar 
          userName={userInfo?.fullName} 
          userImage={userInfo?.profilePicture} 
        />
      {/* </div> */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="md:hidden mb-6">
            {userInfo && (
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
                <img
                  src={userInfo.profilePicture || '/default-avatar.png'}
                  alt={userInfo.fullName}
                  className="w-16 h-16 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <div>
                  <h2 className="text-xl font-semibold">{userInfo.fullName}</h2>
                  <p className="text-gray-500">{userInfo.email}</p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Lịch Học Của Tôi</h1>
            <UserCalendar schedules={schedules} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCalendarPage;