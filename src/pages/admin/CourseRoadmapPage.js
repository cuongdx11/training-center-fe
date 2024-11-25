import React, { useState, useEffect } from 'react';
import {  ChevronDown, ChevronRight, Clock, Plus, X } from 'lucide-react';
import { getCourses } from '../../services/coursesService';
import {getSectionsByCourseId ,addSection} from '../../services/sectionService';
import {addLesson} from '../../services/lessonService';
const CourseRoadmap = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState({});
  
  // States for new section
  const [newSection, setNewSection] = useState({
    title: '',
    description: ''
  });

  // States for new lesson
  const [newLesson, setNewLesson] = useState({
    title: '',
    content: '',
    duration: '',
    sectionId: ''
  });

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch sections when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchSections(selectedCourse.id);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchSections = async (courseId) => {
    try {
      
      const data = await getSectionsByCourseId(courseId);
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    try {
      const data = await addSection(newSection,selectedCourse.id)
      setSections([...sections, data]);
      setNewSection({ title: '', description: '' });
      setShowAddSection(false);
    } catch (error) {
      console.error('Error adding section:', error);
    }
  };

  const handleAddLesson = async (sectionId) => {
    try {
      const data = await addLesson(newLesson,sectionId)
      
      const updatedSections = sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            lessons: [...(section.lessons || []), data]
          };
        }
        return section;
      });
      
      setSections(updatedSections);
      setNewLesson({
        title: '',
        content: '',
        duration: '',
        sectionId: ''
      });
      setShowAddLesson({ ...showAddLesson, [sectionId]: false });
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Course Selection */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Quản Lý Lộ Trình Khóa Học</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn Khóa Học
          </label>
          <select
            value={selectedCourse?.id || ''}
            onChange={(e) => {
              const course = courses.find(c => c.id === e.target.value);
              setSelectedCourse(course);
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn khóa học --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roadmap Content */}
      {selectedCourse && (
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Lộ Trình: {selectedCourse.name}
            </h2>
            <button
              onClick={() => setShowAddSection(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm Chương
            </button>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg shadow-sm">
                <div
                  className="p-4 cursor-pointer flex items-center justify-between bg-white rounded-t-lg"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center">
                    {expandedSections[section.id] ? 
                      <ChevronDown className="w-5 h-5 mr-2" /> : 
                      <ChevronRight className="w-5 h-5 mr-2" />
                    }
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddLesson({ ...showAddLesson, [section.id]: true });
                    }}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm Bài Học
                  </button>
                </div>

                {expandedSections[section.id] && (
                  <div className="p-4 bg-gray-50 rounded-b-lg">
                    <p className="text-gray-600 mb-4">{section.description}</p>
                    
                    {/* Lessons List */}
                    <div className="space-y-3">
                      {section.lessons?.map((lesson) => (
                        <div key={lesson.id} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-lg">{lesson.title}</h4>
                              <p className="text-gray-600 mt-1">{lesson.content}</p>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{lesson.duration} phút</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Lesson Modal */}
                {showAddLesson[section.id] && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Thêm Bài Học Mới</h2>
                        <button
                          onClick={() => setShowAddLesson({ ...showAddLesson, [section.id]: false })}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề bài học
                          </label>
                          <input
                            type="text"
                            value={newLesson.title}
                            onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nội dung
                          </label>
                          <textarea
                            value={newLesson.content}
                            onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thời lượng (phút)
                          </label>
                          <input
                            type="number"
                            value={newLesson.duration}
                            onChange={(e) => setNewLesson({...newLesson, duration: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowAddLesson({ ...showAddLesson, [section.id]: false })}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => handleAddLesson(section.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Thêm Bài Học
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Section Modal */}
          {showAddSection && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Thêm Chương Mới</h2>
                  <button
                    onClick={() => setShowAddSection(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddSection} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      value={newSection.title}
                      onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      value={newSection.description}
                      onChange={(e) => setNewSection({...newSection, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddSection(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Thêm Chương
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedCourse && (
        <div className="text-center text-gray-500 py-8">
          Vui lòng chọn khóa học để xem và quản lý lộ trình
        </div>
      )}
    </div>
  );
};

export default CourseRoadmap;