import React, { useState, useEffect } from 'react';
import { getTopics, addTopic, deleteTopic, addCourseToTopic, removeCourseFromTopic, getCoursesOfTopic } from '../../../services/courseTopicService';
import { getAllCourses } from '../../../services/coursesService';
import { Plus, X, Check, ChevronDown } from 'lucide-react';

const TopicManagement = () => {
  const [topics, setTopics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [selectedCourses, setSelectedCourses] = useState({});
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isAddCoursesOpen, setIsAddCoursesOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', description: '' });
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
      // Update selectedCourses state for the dropdown
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
    } catch (err) {
      setError('Failed to add topic');
    }
  };

  const handleDeleteTopic = async (id) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteTopic(id);
        fetchTopics();
      } catch (err) {
        setError('Failed to delete topic');
      }
    }
  };

  const handleCourseSelection = async (topicId, courseId, isSelected) => {
    try {
      if (isSelected) {
        await addCourseToTopic(topicId, courseId);
      } else {
        await removeCourseFromTopic(topicId, courseId);
      }
      fetchTopicCourses(topicId);
      fetchTopics();
    } catch (err) {
      setError(isSelected ? 'Failed to add course' : 'Failed to remove course');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
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
          Add New Topic
        </button>

        <button
          onClick={() => setIsAddCoursesOpen(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Courses to Topic
        </button>
      </div>

      {/* Add Topic Modal */}
      {isAddTopicOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add New Topic</h2>
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
                  Topic Name
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
                  Description
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Topic
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
              <h2 className="text-2xl font-bold">Add Courses to Topic</h2>
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
                  Select Topic
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
                  <option value="">Choose a topic</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              </div>

              {selectedTopicId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Courses
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                      className="w-full p-3 border rounded-lg flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                    >
                      Select Courses
                      <ChevronDown size={20} className={`transition-transform duration-200 ${isCourseDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isCourseDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {courses.map(course => {
                          const isSelected = selectedCourses[course.id];
                          return (
                            <div
                              key={course.id}
                              className="p-3 hover:bg-gray-100 flex items-center gap-3 cursor-pointer transition-colors"
                              onClick={() => {
                                const newValue = !isSelected;
                                setSelectedCourses(prev => ({
                                  ...prev,
                                  [course.id]: newValue
                                }));
                                handleCourseSelection(selectedTopicId, course.id, newValue);
                              }}
                            >
                              <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>
                                {isSelected && <Check size={16} className="text-white" />}
                              </div>
                              <span>{course.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
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
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topics.map(topic => (
          <div key={topic.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 
                className="text-xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handleTopicClick(topic.id)}
              >
                {topic.name}
              </h3>
              <button
                onClick={() => handleDeleteTopic(topic.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{topic.description}</p>
            
            {expandedTopicId === topic.id && selectedTopicCourses.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Courses:</h4>
                <div className="space-y-2">
                  {selectedTopicCourses.map(course => (
                    <div key={course.id} className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                      <span className="text-purple-700">{course.title}</span>
                      <button
                        onClick={() => handleCourseSelection(topic.id, course.id, false)}
                        className="text-purple-400 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicManagement;