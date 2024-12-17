import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RevenueStats from '../../components/admin/dashboard/RevenueStats';
import RecentStudents from '../../components/admin/dashboard/RecentStudents';
import CourseRevenueStats from '../../components/admin/dashboard/CourseRevenueStats';
import StatCardList from '../../components/admin/dashboard/StatCardList';

const DashboardPage = () => {
  

  const location = useLocation();

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success('Đăng nhập thành công!', {
        autoClose: 1000,
        hideProgressBar: true,
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div >
      <StatCardList />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueStats />
        <RecentStudents />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-4">
          <CourseRevenueStats />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DashboardPage;
