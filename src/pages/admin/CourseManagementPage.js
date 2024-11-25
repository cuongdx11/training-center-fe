import React, { useState, useEffect } from 'react';
// import { PlusCircle } from 'lucide-react';
import CourseForm from '../../components/admin/courses/CourseForm';
import CourseTable from '../../components/admin/courses/CourseTable';
import Modal from '../../components/admin/courses/Modal';
import SearchBar from '../../components/admin/courses/SearchBar';
import Header from '../../components/admin/courses/Header';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../../services/coursesService';
import { getCategories } from '../../services/categoryService';
import  userService  from '../../services/userService';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const emptyCourseForm = {
    categoryId: "",
    title: "",
    description: "",
    duration: "",
    level: "BEGINNER",
    price: "",
    thumbnail: null,
    instructorIds: []
  };

  const [newCourse, setNewCourse] = useState(emptyCourseForm);
  const [editingCourse, setEditingCourse] = useState(emptyCourseForm);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [coursesResponse, categoriesResponse, instructorsResponse] = await Promise.all([
        getCourses(),
        getCategories(),
        userService.getInstructors()
      ]);
      
      setCourses(coursesResponse);
      setCategories(categoriesResponse.data);
      setInstructors(instructorsResponse);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      console.error('Error fetching data:', err);
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
      categoryId: course.category.id,
      duration: course.duration.toString(),
      price: course.price.toString(),
      instructorIds: course.instructors.map(instructor => instructor.id)
    });
    setShowEditModal(true);
  };

  const handleEditCourse = async (formData) => {
    try {
      await updateCourse(selectedCourse.id, formData);
      setShowEditModal(false);
      fetchInitialData();
    } catch (err) {
      console.error('Error updating course:', err);
      alert('Không thể cập nhật khóa học. Vui lòng thử lại!');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        await deleteCourse(courseId);
        fetchInitialData();
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Không thể xóa khóa học. Vui lòng thử lại!');
      }
    }
  };

  const handleAddCourse = async (formData) => {
    try {
      await addCourse(formData);
      setShowAddModal(false);
      fetchInitialData();
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
      <Header onAddClick={() => setShowAddModal(true)} />
      <SearchBar value={searchTerm} onChange={handleSearch} />
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
          categories={categories}
          instructors={instructors}
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
          categories={categories}
          instructors={instructors}
        />
      </Modal>
    </div>
  );
};

export default CourseManagementPage;