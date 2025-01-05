import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCourseClass from '../../components/admin/courses/CreateCourseClass';
import CourseClassTable from '../../components/admin/courses/CourseClassTable';
import Modal from '../../components/admin/courses/Modal';
import { PlusCircle } from 'lucide-react';
import { getClassesWithFilters, deleteClass } from '../../services/courseClassService';
import { getAllCourses } from '../../services/coursesService';
import userService from '../../services/userService';
import FilterClass from '../../components/admin/courses/FilterClass';

const CourseClassPage = () => {
  const [courseClasses, setCourseClasses] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    className: '',
    courseId: '',
    instructorId: '',
    page: 0,
    size: 10
  });

  const fetchClassesData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getClassesWithFilters(filters);
      setCourseClasses(response);
    } catch (err) {
      setError('Không thể tải dữ liệu lớp học. Vui lòng thử lại sau.');
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchInitialData = useCallback(async () => {
    try {
      await fetchClassesData();
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      console.error('Error fetching data:', err);
    }
  }, [fetchClassesData]);

  useEffect(() => {
    fetchInitialData();
    fetchCourses();
    fetchInstructors();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchClassesData();
  }, [fetchClassesData]);

  const fetchCourses = async () => {
    try {
      const coursesData = await getAllCourses();
      setCourses(coursesData);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchInstructors = async () => {
    try {
      const instructorsData = await userService.getInstructors();
      setInstructors(instructorsData);
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };

  const handleSearch = (searchParams) => {
    setFilters(prev => ({
      ...prev,
      className: searchParams.className || '',
      courseId: searchParams.courseId || '',
      instructorId: searchParams.instructorId || '',
      page: 0
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleEditClick = (classData) => {
    setSelectedClass({
      ...classData,
      id: classData.id,
      courseId: classData.course?.id,
      instructorId: classData.instructor?.id
    });
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    alert('Lớp học đã được cập nhật thành công!');
    fetchClassesData();
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedClass(null);
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        await deleteClass(classId);
        fetchClassesData();
        alert('Lớp học đã được xóa!');
      } catch (err) {
        console.error('Error deleting class:', err);
        alert('Không thể xóa lớp học. Vui lòng thử lại!');
      }
    }
  };

  const handleAddClass = () => {
    navigate("/admin/courses/create-class");
  };

  if (loading && !courseClasses.content.length) {
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
      <div className="flex justify-between items-center p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Lớp học</h1>
        <button 
          onClick={handleAddClass}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Tạo lớp học
        </button>
      </div>
      
      <FilterClass 
        onSearch={handleSearch}
        courses={courses}
        instructors={instructors}
      />

      <CourseClassTable
        courseClasses={courseClasses.content}
        onEdit={handleEditClick}
        onDelete={handleDeleteClass}
        currentPage={filters.page}
        totalPages={courseClasses.totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />

      <Modal open={showEditModal} onClose={handleCloseModal}>
        <CreateCourseClass
          initialData={selectedClass}
          onSuccess={handleEditSuccess}
          onCancel={handleCloseModal}
          isEditing={true}
        />
      </Modal>
    </div>
  );
};

export default CourseClassPage;