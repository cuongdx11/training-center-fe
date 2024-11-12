import React, { useState, useEffect } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import CourseForm from '../../components/admin/courses/CourseForm';
import CourseTable from '../../components/admin/courses/CourseTable';
import Modal from '../../components/admin/courses/Modal';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../../services/coursesService';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const emptyCourseForm = {
    title: "",
    description: "",
    duration: "",
    level: "BEGINNER",
    price: "",
    thumbnail: ""
  };
  const [newCourse, setNewCourse] = useState(emptyCourseForm);
  const [editingCourse, setEditingCourse] = useState(emptyCourseForm);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses();
      setCourses(response.data);
    } catch (err) {
      setError('Không thể tải danh sách khóa học');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setEditingCourse({
      ...course,
      duration: course.duration.toString(),
      price: course.price.toString()
    });
    setShowEditModal(true);
  };

  const handleEditCourse = async () => {
    try {
      const courseData = {
        ...editingCourse,
        duration: parseInt(editingCourse.duration),
        price: parseFloat(editingCourse.price)
      };

      await updateCourse(selectedCourse.id, courseData);
      setShowEditModal(false);
      fetchCourses();
    } catch (err) {
      console.error('Error updating course:', err);
      alert('Không thể cập nhật khóa học. Vui lòng thử lại!');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        await deleteCourse(courseId);
        fetchCourses();
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Không thể xóa khóa học. Vui lòng thử lại!');
      }
    }
  };

  const handleAddCourse = async () => {
    try {
      // Kiểm tra dữ liệu trước khi gửi
      if (!newCourse.title || !newCourse.description || !newCourse.duration || !newCourse.price) {
        alert('Vui lòng điền đầy đủ thông tin khóa học');
        return;
      }

      const courseData = {
        ...newCourse,
        duration: parseInt(newCourse.duration),
        price: parseFloat(newCourse.price)
      };

      console.log('Sending course data:', courseData); // Thêm log để debug
      await addCourse(courseData);
      setShowAddModal(false);
      fetchCourses();
      setNewCourse(emptyCourseForm);
    } catch (err) {
      console.error('Error adding course:', err);
      alert('Không thể thêm khóa học. Vui lòng thử lại!');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Khóa học</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Thêm khóa học
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Course Table */}
      <CourseTable
        courses={filteredCourses}
        onEdit={handleEditClick}
        onDelete={handleDeleteCourse}
      />

      {/* Add Course Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2 className="text-xl font-bold mb-4">Thêm khóa học mới</h2>
        <CourseForm
          data={newCourse}
          setData={setNewCourse}
          onSubmit={handleAddCourse}
          onCancel={() => setShowAddModal(false)}
          submitText="Thêm khóa học"
        />
      </Modal>

      {/* Edit Course Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa khóa học</h2>
        <CourseForm
          data={editingCourse}
          setData={setEditingCourse}
          onSubmit={handleEditCourse}
          onCancel={() => setShowEditModal(false)}
          submitText="Lưu thay đổi"
        />
      </Modal>
    </div>
  );
};

export default CourseManagementPage;