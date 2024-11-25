import React from 'react';
import { Brain, Code2, Users } from 'lucide-react';

const LearningPath = () => {
  const steps = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Học lý thuyết",
      description: "Nắm vững kiến thức nền tảng từ các giảng viên giàu kinh nghiệm"
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Thực hành dự án",
      description: "Áp dụng kiến thức vào các dự án thực tế"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Kết nối doanh nghiệp",
      description: "Được giới thiệu việc làm tại các công ty đối tác"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Lộ trình học tập</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPath;