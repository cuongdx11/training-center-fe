import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCourseClass from '../../components/admin/courses/CreateCourseClass';
import CourseClassTable from '../../components/admin/courses/CourseClassTable';
import Modal from '../../components/admin/courses/Modal';
import SearchBar from '../../components/admin/courses/SearchBar';
import { PlusCircle } from 'lucide-react';
import { getClass, deleteClass } from '../../services/courseClassService';

const CourseClassPage = () => {
  const [courseClass, setCourseClass] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const courseClassResponse = await getClass();
      setCourseClass(courseClassResponse);
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
    fetchInitialData();
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedClass(null);
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        await deleteClass(classId);
        fetchInitialData();
      } catch (err) {
        console.error('Error deleting class:', err);
        alert('Không thể xóa lớp học. Vui lòng thử lại!');
      }
    }
  };

  const handleAddClass = () => {
    navigate("/admin/courses/create-class");
  };

  const filteredCourseClass = courseClass.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
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

        <div className="flex justify-between items-center p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Lớp học</h1>
            <button onClick={handleAddClass} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusCircle className="w-4 h-4" />
                Tạo lớp học
            </button>
        </div>

      <SearchBar value={searchTerm} onChange={handleSearch} />
      <CourseClassTable
        courseClass={filteredCourseClass}
        onEdit={handleEditClick}
        onDelete={handleDeleteClass}
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