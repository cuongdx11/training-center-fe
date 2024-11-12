import React from 'react';
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
} from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const stats = [
    {
      title: 'Tổng Học Viên',
      value: '1,234',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Khóa Học Đang Mở',
      value: '15',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: 'bg-green-500'
    },
    {
      title: 'Giảng Viên',
      value: '25',
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Doanh Thu Tháng',
      value: '45.5M',
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Khóa Học Mới Nhất</h2>
          <div className="space-y-4">
            {/* Placeholder cho danh sách khóa học */}
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Khóa học React JS</h3>
                  <p className="text-sm text-gray-500">20 học viên đăng ký</p>
                </div>
                <span className="text-green-500 font-medium">12.5M VND</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Học Viên Mới Đăng Ký</h2>
          <div className="space-y-4">
            {/* Placeholder cho danh sách học viên */}
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-2 border-b">
                <img
                  src={`/api/placeholder/40/40`}
                  alt="Student"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">Nguyễn Văn A</h3>
                  <p className="text-sm text-gray-500">Đăng ký: React JS</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;