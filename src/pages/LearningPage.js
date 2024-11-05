import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../services/coursesService';
import { ChevronLeft, ChevronDown, Clock, PlayCircle } from 'lucide-react';

const LearningPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(courseId);
        setCourse(response.data);
        if (response.data.sectionList[0]?.lessonList[0]) {
          setCurrentLesson(response.data.sectionList[0].lessonList[0]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin khóa học:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getSectionStats = (section) => {
    const totalLessons = section.lessonList.length;
    const totalDuration = section.lessonList.reduce((sum, lesson) => 
      sum + parseInt(lesson.duration || 0), 0);
    return `${totalLessons} bài học | ${Math.floor(totalDuration / 60)}:${String(totalDuration % 60).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-red-500 border-gray-700 rounded-full animate-spin mb-4"></div>
          <span className="text-lg">Đang tải khóa học...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Không tìm thấy khóa học</h2>
          <p className="text-gray-400">Vui lòng kiểm tra lại đường dẫn của bạn</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-800/95 backdrop-blur-sm flex items-center px-4 z-20 border-b border-gray-700">
        <button className="flex items-center text-white hover:text-red-400 transition-colors duration-300">
          <ChevronLeft className="w-5 h-5" />
          <span className="ml-2">Quay lại</span>
        </button>
        <h1 className="ml-4 font-medium text-white truncate">{course.title}</h1>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-auto text-white hover:text-red-400 transition-colors duration-300"
        >
          {sidebarOpen ? 'Ẩn mục lục' : 'Hiện mục lục'}
        </button>
      </div>

      {/* Main container */}
      <div className="fixed inset-0 mt-16 flex">
        {/* Video player area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-4xl mx-auto">
            <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden shadow-2xl bg-gray-800">
              {currentLesson ? (
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentLesson.videoLink)}`}
                  title={currentLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <p>Chọn một bài học để bắt đầu</p>
                  </div>
                </div>
              )}
            </div>
            {currentLesson && (
              <div className="mt-6 bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm animate-fadeIn">
                <h2 className="text-xl font-bold text-white">{currentLesson.title}</h2>
                <p className="mt-3 text-gray-300 leading-relaxed">{currentLesson.content}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div 
          className={`w-96 bg-gray-800/95 backdrop-blur-sm overflow-y-auto border-l border-gray-700 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-6 text-white">Nội dung khóa học</h2>
            
            <div className="space-y-3">
              {course.sectionList.map((section, index) => (
                <div 
                  key={section.id}
                  className="border border-gray-700 rounded-lg overflow-hidden animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/50 transition-colors duration-300"
                    onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                  >
                    <div>
                      <div className="font-medium text-white">
                        Phần {index + 1}: {section.title}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {getSectionStats(section)}
                      </div>
                    </div>
                    <ChevronDown 
                      className={`text-gray-400 transform transition-transform duration-300 ${
                        expandedSection === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      expandedSection === index ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0'
                    } border-t border-gray-700`}
                  >
                    {section.lessonList.length > 0 ? (
                      section.lessonList.map((lesson, lessonIndex) => (
                        <div 
                          key={lesson.id}
                          className={`flex items-center space-x-2 p-4 cursor-pointer transition-colors duration-300
                            ${currentLesson?.id === lesson.id ? 
                              'bg-red-500/10 hover:bg-red-500/20' : 
                              'hover:bg-gray-700/30'}`}
                          onClick={() => setCurrentLesson(lesson)}
                        >
                          <div className="flex-1">
                            <div className="text-white">
                              {lessonIndex + 1}. {lesson.title}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center mt-1">
                              <Clock className="w-4 h-4 mr-1" />
                              {Math.floor(parseInt(lesson.duration) / 60)}:
                              {String(parseInt(lesson.duration) % 60).padStart(2, '0')}
                            </div>
                          </div>
                          {currentLesson?.id === lesson.id && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 p-4">
                        Không có bài học nào trong phần này.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;