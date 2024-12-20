import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';  
import { getUserStatistics } from '../../../services/statisticsService';  
import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react';

const StatCardList = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API lấy dữ liệu
    const fetchStats = async () => {
      try {
        const data = await getUserStatistics(); 
        setStats([
          {
            title: 'Tổng Học Viên',
            value: data.totalStudents.toString(),
            icon: <Users className="w-6 h-6 text-white" />, 
            color: 'bg-blue-500'
          },
          {
            title: 'Giảng Viên',
            value: data.totalInstructors.toString(),
            icon: <GraduationCap className="w-6 h-6 text-white" />,
            color: 'bg-purple-500'
          },
          {
            title: 'Khóa Học Đang Mở',
            value: '15',
            icon: <BookOpen className="w-6 h-6 text-white" />,
            color: 'bg-green-500'
          },
          {
                title: 'Tổng doanh thu',
                value: '2',
                icon: <DollarSign className="w-6 h-6 text-white" />,
                color: 'bg-yellow-500'
              }
        ]);
        setLoading(false);
      } catch (err) {
        setError('Có lỗi xảy ra khi lấy dữ liệu');
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // Chạy một lần khi component mount

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}  // Đảm bảo rằng bạn có icon trong response nếu cần
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatCardList;