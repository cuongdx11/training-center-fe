import React, { useState } from 'react';
import { Search, BookOpen, Clock, Activity, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const MyCourses = ({ courses }) => {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('learning'); // learning, completed, saved

  const filteredCourses = courses?.filter(course => {
    const courseDetails = course.course; // Truy cập vào thuộc tính course
    if (!courseDetails) return false; // Nếu không có course, không cần kiểm tra thêm
  
    const matchesSearch = courseDetails.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'learning') return matchesSearch && course.progress > 0 && course.progress < 100;
    if (activeTab === 'completed') return matchesSearch && course.progress === 100;
    if (activeTab === 'saved') return matchesSearch && course.progress === 0;
    return true;
  });

  const TabButton = ({ label, value, count }) => (
    <button
      className={`px-6 py-3 text-sm font-medium rounded-lg flex items-center space-x-2
        ${activeTab === value 
          ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'
        }`}
      onClick={() => setActiveTab(value)}
    >
      <span>{label}</span>
      {count > 0 && (
        <span className={`px-2 py-1 rounded-full text-xs ${
          activeTab === value ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-medium mb-6">Khóa học của tôi</h1>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-4 px-6">
          <TabButton 
            label="Đang học" 
            value="learning" 
            count={courses?.filter(c => c.progress > 0 && c.progress < 100).length} 
          />
          <TabButton 
            label="Đã hoàn thành" 
            value="completed" 
            count={courses?.filter(c => c.progress === 100).length} 
          />
          <TabButton 
            label="Đã lưu" 
            value="saved" 
            count={courses?.filter(c => c.progress === 0).length} 
          />
        </div>
      </div>

      {/* Course List */}
      <div className="p-6 space-y-6">
        {filteredCourses?.map((course) => (
          <div
            key={course.id}
            className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Course Thumbnail */}
            <div className="w-full md:w-64 h-40 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={course.course.thumbnail} // Sửa thành course.course.thumbnail
                alt={course.course.title} // Sửa thành course.course.title
                className="w-full h-full object-cover"
              />
            </div>

            {/* Course Info */}
            <div className="flex-1 flex flex-col">
              <div>
                <h3 className="text-lg font-medium mb-2">{course.course.title}</h3> {/* Sửa thành course.course.title */}
                <p className="text-gray-600 text-sm mb-4">{course.course.description}</p> {/* Sửa thành course.course.description */}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <BookOpen size={16} className="mr-1" />
                    <span>{course.course.lessonsCount} bài học</span> {/* Sửa thành course.course.lessonsCount */}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>{course.course.duration} phút</span> {/* Sửa thành course.course.duration và thêm 'phút' */}
                  </div>
                  <div className="flex items-center">
                    <Activity size={16} className="mr-1" />
                    <span>{course.course.level}</span> {/* Sửa thành course.course.level */}
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {course.progress > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Tiến độ: {course.progress}%
                      </span>
                      {course.progress === 100 && (
                        <span className="flex items-center text-green-600 text-sm">
                          <BadgeCheck size={16} className="mr-1" />
                          Đã hoàn thành
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </>
                )}

                <div className="mt-4 flex justify-end">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => navigate(`/courses/${course.course.id}/schedule`)} // Chuyển hướng tại đây
                >
                  {course.progress === 0 ? 'Bắt đầu học' : 'Tiếp tục học'}
                </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredCourses?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {activeTab === 'learning' && "Bạn chưa bắt đầu học khóa học nào"}
              {activeTab === 'completed' && "Bạn chưa hoàn thành khóa học nào"}
              {activeTab === 'saved' && "Bạn chưa lưu khóa học nào"}
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Khám phá khóa học
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
