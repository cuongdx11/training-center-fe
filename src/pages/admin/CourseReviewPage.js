import React, { useState, useEffect } from 'react';
// import { PlusCircle } from 'lucide-react';
import CourseReviewTable from '../../components/admin/reviews/CourseReviewTable';
// import Modal from '../../components/admin/reviews/Modal';
import Header from '../../components/admin/reviews/Header';
import { getCourses } from '../../services/coursesService';
import { deleteReview, listReviewByCourse } from '../../services/courseReview';
import { useParams } from 'react-router-dom';


const CourseReviewPage = () => {
  const { courseId } = useParams();
  const [courseReviews, setCourseReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [showAddModal, setShowAddModal] = useState(false);
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [courseReviewsResponse, coursesResponse] = await Promise.all([
        listReviewByCourse(courseId),
        getCourses()
      ]);
      const course = coursesResponse.find(course => course.id === courseId);
      setCourseName(course?.title || "Khóa học không tìm thấy");
      
      setCourseReviews(courseReviewsResponse);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourseReview = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        await deleteReview(courseId);
        fetchInitialData();
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Không thể xóa khóa học. Vui lòng thử lại!');
      }
    }
  };


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
      <Header 
        review = {courseName}
        // onAddClick={() => setShowAddModal(true)} 
      />
      <CourseReviewTable
        courseReviews={courseReviews}
        onDelete={handleDeleteCourseReview}
      />

    </div>
  );
};

export default CourseReviewPage;