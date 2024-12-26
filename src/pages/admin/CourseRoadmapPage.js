import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Clock, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllCourses } from '../../services/coursesService';
import { getSectionsByCourseId, addSection, updateSection, deleteSection } from '../../services/sectionService';
import { addLesson, updateLesson, deleteLesson } from '../../services/lessonService';

const CourseRoadmap = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState({});
  const [showEditSection, setShowEditSection] = useState(null);
  const [showEditLesson, setShowEditLesson] = useState(null);

  // States for new/edit section
  const [sectionForm, setSectionForm] = useState({
    title: '',
    description: ''
  });

  // States for new/edit lesson
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    duration: '',
    sectionId: '',
    videoLink: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchSections(selectedCourse.id);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Không thể tải danh sách khóa học');
    }
  };

  const fetchSections = async (courseId) => {
    try {
      const data = await getSectionsByCourseId(courseId);
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Không thể tải danh sách chương');
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    try {
      const data = await addSection(sectionForm, selectedCourse.id);
      setSections([...sections, data]);
      setSectionForm({ title: '', description: '' });
      setShowAddSection(false);
      toast.success('Thêm chương mới thành công!');
    } catch (error) {
      console.error('Error adding section:', error);
      toast.error('Không thể thêm chương mới');
    }
  };

  const handleEditSection = async (e) => {
    e.preventDefault();
    try {
      const data = await updateSection(showEditSection, sectionForm);
      setSections(sections.map(section => 
        section.id === showEditSection ? data : section
      ));
      setSectionForm({ title: '', description: '' });
      setShowEditSection(null);
      toast.success('Cập nhật chương thành công!');
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Không thể cập nhật chương');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chương này?')) {
      try {
        await deleteSection(sectionId);
        setSections(sections.filter(section => section.id !== sectionId));
        toast.success('Xóa chương thành công!');
      } catch (error) {
        console.error('Error deleting section:', error);
        toast.error('Không thể xóa chương');
      }
    }
  };

  const handleAddLesson = async (sectionId) => {
    try {
      const data = await addLesson(lessonForm, sectionId);
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
      setLessonForm({ title: '', content: '', duration: '', sectionId: '',videoLink:'' });
      setShowAddLesson({ ...showAddLesson, [sectionId]: false });
      toast.success('Thêm bài học mới thành công!');
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('Không thể thêm bài học mới');
    }
  };

  const handleEditLesson = async (lessonId, sectionId) => {
    try {
      const data = await updateLesson(lessonId, lessonForm);
      const updatedSections = sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            lessons: section.lessons.map(lesson =>
              lesson.id === lessonId ? data : lesson
            )
          };
        }
        return section;
      });
      setSections(updatedSections);
      setLessonForm({ title: '', content: '', duration: '', sectionId: '' ,videoLink:''});
      setShowEditLesson(null);
      toast.success('Cập nhật bài học thành công!');
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Không thể cập nhật bài học');
    }
  };

  const handleDeleteLesson = async (lessonId, sectionId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
      try {
        await deleteLesson(lessonId);
        const updatedSections = sections.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
            };
          }
          return section;
        });
        setSections(updatedSections);
        toast.success('Xóa bài học thành công!');
      } catch (error) {
        console.error('Error deleting lesson:', error);
        toast.error('Không thể xóa bài học');
      }
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
      <ToastContainer position="top-right" autoClose={3000} />
      
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
  {[...sections]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((section) => (
      <div key={section.id} className="border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 bg-white rounded-t-lg flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => toggleSection(section.id)}>
            {expandedSections[section.id] ? 
              <ChevronDown className="w-5 h-5 mr-2" /> : 
              <ChevronRight className="w-5 h-5 mr-2" />
            }
            <h3 className="text-lg font-semibold">{section.title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSectionForm({
                  title: section.title,
                  description: section.description
                });
                setShowEditSection(section.id);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteSection(section.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddLesson({ ...showAddLesson, [section.id]: true })}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm Bài Học
            </button>
          </div>
        </div>

        {expandedSections[section.id] && (
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <p className="text-gray-600 mb-4">{section.description}</p>
            
            {/* Lessons List */}
            <div className="space-y-3">
              {section.lessons && 
                [...section.lessons]
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((lesson) => (
                    <div key={lesson.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">{lesson.title}</h4>
                          <p className="text-gray-600 mt-1">{lesson.content}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{lesson.duration} phút</span>
                          </div>
                          <button
                            onClick={() => {
                              setLessonForm({
                                title: lesson.title,
                                content: lesson.content,
                                duration: lesson.duration,
                                sectionId: section.id,
                                videoLink: lesson.videoLink
                              });
                              setShowEditLesson(lesson.id);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id, section.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
    ))}
</div>

          {/* Add/Edit Section Modal */}
          {(showAddSection || showEditSection) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {showEditSection ? 'Chỉnh Sửa Chương' : 'Thêm Chương Mới'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddSection(false);
                      setShowEditSection(null);
                      setSectionForm({ title: '', description: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={showEditSection ? handleEditSection : handleAddSection} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm({...sectionForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      value={sectionForm.description}
                      onChange={(e) => setSectionForm({...sectionForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {setShowAddSection(false);
                        setShowEditSection(null);
                        setSectionForm({ title: '', description: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {showEditSection ? 'Lưu Thay Đổi' : 'Thêm Chương'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add/Edit Lesson Modal */}
          {(showAddLesson[Object.keys(showAddLesson).find(key => showAddLesson[key])] || showEditLesson) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {showEditLesson ? 'Chỉnh Sửa Bài Học' : 'Thêm Bài Học Mới'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddLesson({});
                      setShowEditLesson(null);
                      setLessonForm({ title: '', content: '', duration: '', sectionId: '' ,videoLink:''});
                    }}
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
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nội dung
                    </label>
                    <textarea
                      value={lessonForm.content}
                      onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link video
                    </label>
                    <input
                      type="text"
                      value={lessonForm.videoLink}
                      onChange={(e) => setLessonForm({...lessonForm, videoLink: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời lượng (phút)
                    </label>
                    <input
                      type="number"
                      value={lessonForm.duration}
                      onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddLesson({});
                        setShowEditLesson(null);
                        setLessonForm({ title: '', content: '', duration: '', sectionId: '',videoLink:'' });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => {
                        const sectionId = showEditLesson 
                          ? lessonForm.sectionId 
                          : Object.keys(showAddLesson).find(key => showAddLesson[key]);
                        showEditLesson 
                          ? handleEditLesson(showEditLesson, sectionId)
                          : handleAddLesson(sectionId);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {showEditLesson ? 'Lưu Thay Đổi' : 'Thêm Bài Học'}
                    </button>
                  </div>
                </div>
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