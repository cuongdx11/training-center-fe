import React from 'react';
import { BookOpen, Users, Award, Clock } from 'lucide-react';

const AboutCenter = () => {
  const stats = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      number: "100+",
      title: "Khóa học",
      description: "Đa dạng các lĩnh vực"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      number: "1000+",
      title: "Học viên",
      description: "Đã tốt nghiệp"
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      number: "50+",
      title: "Giảng viên",
      description: "Giàu kinh nghiệm"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      number: "10+",
      title: "Năm kinh nghiệm",
      description: "Đào tạo chất lượng"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Phần giới thiệu */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Chào mừng đến với Trung tâm Đào tạo
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600">
              Chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực đào tạo, 
              mang đến những khóa học chất lượng cao và phương pháp giảng dạy hiện đại.
            </p>
          </div>
        </div>

        {/* Grid thống kê */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="relative group bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {stat.title}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phần cam kết */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Cam kết của chúng tôi
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Với đội ngũ giảng viên giàu kinh nghiệm và chương trình đào tạo 
              được cập nhật liên tục, chúng tôi cam kết mang đến trải nghiệm 
              học tập tốt nhất cho học viên.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCenter;