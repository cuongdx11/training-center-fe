import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import MainContent from '../components/admin/MainContent';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header />
        <MainContent />
      </div>
    </div>
  );
};

export default AdminLayout;
