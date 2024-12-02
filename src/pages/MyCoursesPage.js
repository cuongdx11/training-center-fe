import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import MyCourses from '../components/MyCourses';
import userService from '../services/userService';

const MyCoursesPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [courses, setCourses] = useState(null);
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, coursesData] = await Promise.all([
          userService.getUserById(userId),
          userService.getMyCourses(userId)
        ]);
        setUserInfo(userData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [userId]);

  if (!userInfo || !courses) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar userName={userInfo.fullName} userImage={userInfo.profilePicture} />
      <div className="flex-1 p-8">
        <MyCourses courses={courses} />
      </div>
    </div>
  );
};

export default MyCoursesPage;