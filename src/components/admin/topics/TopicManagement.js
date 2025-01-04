import React, { useState, useEffect } from 'react';
import { getTopics, addTopic, deleteTopic, updateTopic, addCourseToTopic, removeCourseFromTopic, getCoursesOfTopic } from '../../../services/courseTopicService';
import { getAllCourses } from '../../../services/coursesService';
import { Plus, X, Check, ChevronDown, Edit } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';

const TopicManagement = () => {
  const [topics, setTopics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [selectedCourses, setSelectedCourses] = useState({});
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [isAddCoursesOpen, setIsAddCoursesOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', description: '' });
  const [editingTopic, setEditingTopic] = useState({ id: '', name: '', description: '' });
  const [selectedTopicCourses, setSelectedTopicCourses] = useState([]);
  const [expandedTopicId, setExpandedTopicId] = useState(null);

  useEffect(() => {
    fetchTopics();
    fetchCourses();
  }, []);

  const fetchTopics = async () => {
    try {
      const data = await getTopics();
      setTopics(data);
    } catch (err) {
      setError('Failed to fetch topics');
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  const fetchTopicCourses = async (topicId) => {
    try {
      const courses = await getCoursesOfTopic(topicId);
      setSelectedTopicCourses(courses);
      const courseMap = {};
      courses.forEach(course => {
        courseMap[course.id] = true;
      });
      setSelectedCourses(courseMap);
    } catch (err) {
      setError('Failed to fetch topic courses');
    }
  };

  const handleTopicClick = async (topicId) => {
    if (expandedTopicId === topicId) {
      setExpandedTopicId(null);
      setSelectedTopicCourses([]);
    } else {
      setExpandedTopicId(topicId);
      await fetchTopicCourses(topicId);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    try {
      await addTopic(newTopic);
      setIsAddTopicOpen(false);
      setNewTopic({ name: '', description: '' });
      fetchTopics();
      toast.success('Chủ đề đã được thêm thành công!');
    } catch (err) {
      toast.error('Không thể thêm chủ đề!');
    }
  };

  const handleEditTopic = async (e) => {
    e.preventDefault();
    try {
      await updateTopic(editingTopic.id, {
        name: editingTopic.name,
        description: editingTopic.description
      });
      setIsEditTopicOpen(false);
      setEditingTopic({ id: '', name: '', description: '' });
      fetchTopics();
      toast.success('Chủ đề đã được cập nhật thành công!');
    } catch (err) {
      toast.error('Không thể cập nhật chủ đề!');
    }
  };

  const handleDeleteTopic = async (id) => {
    Swal.fire({
      title: 'Xác nhận xóa chủ đề?',
      text: "Bạn không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTopic(id);
          fetchTopics();
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Chủ đề đã được xóa thành công.',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
        } catch (err) {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Không thể xóa chủ đề.',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        }
      }
    });
  };

  const handleOpenEditModal = (topic) => {
    setEditingTopic({
      id: topic.id,
      name: topic.name,
      description: topic.description
    });
    setIsEditTopicOpen(true);
  };

  const handleCourseSelection = async (topicId, courseId, isSelected) => {
    try {
      if (isSelected) {
        await addCourseToTopic(topicId, courseId);
        toast.success('Khóa học đã được thêm vào chủ đề!');
      } else {
        await removeCourseFromTopic(topicId, courseId);
        toast.info('Khóa học đã được xóa khỏi chủ đề!');
      }
      fetchTopicCourses(topicId);
      fetchTopics();
    } catch (err) {
      toast.error(isSelected ? 'Không thể thêm khóa học!' : 'Không thể xóa khóa học!');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setIsAddTopicOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Thêm chủ đề mới
        </button>

        <button
          onClick={() => setIsAddCoursesOpen(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Thêm khóa học vào chủ đề
        </button>
      </div>

      {/* Add Topic Modal */}
      {isAddTopicOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Thêm mới chủ đề</h2>
              <button
                onClick={() => setIsAddTopicOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddTopic} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chủ đề
                </label>
                <input
                  type="text"
                  value={newTopic.name}
                  onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddTopicOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu chủ đề
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}
      {isEditTopicOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chỉnh sửa chủ đề</h2>
              <button
                onClick={() => setIsEditTopicOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditTopic} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chủ đề
                </label>
                <input
                  type="text"
                  value={editingTopic.name}
                  onChange={(e) => setEditingTopic({ ...editingTopic, name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={editingTopic.description}
                  onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditTopicOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Courses Modal */}
      {isAddCoursesOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Thêm khóa học vào chủ đề</h2>
              <button
                onClick={() => {
                  setIsAddCoursesOpen(false);
                  setSelectedTopicId('');
                  setSelectedCourses({});
                  setIsCourseDropdownOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn chủ đề
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => {
                    setSelectedTopicId(e.target.value);
                    if (e.target.value) {
                      fetchTopicCourses(e.target.value);
                    }
                  }}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  required
                >
                  <option value="">Chọn một chủ đề</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              </div>

              {selectedTopicId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chọn khóa học
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none flex justify-between items-center"
                    >
                      <span>Chọn khóa học để thêm</span>
                      <ChevronDown size={20} />
                    </button>

                    {isCourseDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {courses.map(course => (
                          <div
                            key={course.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              const isSelected = !selectedCourses[course.id];
                              setSelectedCourses(prev => ({
                                ...prev,
                                [course.id]: isSelected
                              }));
                              handleCourseSelection(selectedTopicId, course.id, isSelected);
                            }}
                          >
                            <span>{course.title}</span>
                            {selectedCourses[course.id] && <Check size={20} className="text-green-500" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCoursesOpen(false);
                    setSelectedTopicId('');
                    setSelectedCourses({});
                    setIsCourseDropdownOpen(false);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topics List */}
      <div className="space-y-4">
        {topics.map(topic => (
          <div key={topic.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold">{topic.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(topic)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{topic.description}</p>
              </div>
              <button
                onClick={() => handleTopicClick(topic.id)}
                className="ml-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronDown
                  size={24}
                  className={`transform transition-transform ${
                    expandedTopicId === topic.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {expandedTopicId === topic.id && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-lg font-medium mb-3">Khóa học trong chủ đề:</h4>
                {selectedTopicCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedTopicCourses.map(course => (
                      <div
                        key={course.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span>{course.title}</span>
                        <button
                          onClick={() => handleCourseSelection(topic.id, course.id, false)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Chưa có khóa học nào trong chủ đề này.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicManagement;