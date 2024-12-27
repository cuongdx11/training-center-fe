import React, { useState, useEffect, useCallback } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { getAll, deleteReview } from '../../services/courseReview';
import { getAllCourses } from '../../services/coursesService';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAll(selectedCourse, selectedRating, debouncedKeyword, page, pageSize);
      setReviews(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, selectedRating, selectedCourse, debouncedKeyword]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getAllCourses();
        setCourses(coursesData);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleDeleteReview = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        await deleteReview(id);
        await fetchReviews();
        toast.success('Xóa thành công!');
      } catch (err) {
        setError('Không thể xóa đánh giá. Vui lòng thử lại sau.');
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
       <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đánh giá khóa học</h1>
      </div>

      <div className="p-4 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo nội dung review..."
          className="p-2 border rounded-lg flex-1"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          className="p-2 border rounded-lg w-48"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Tất cả khóa học</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg w-48"
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="">Tất cả đánh giá</option>
          {[5, 4, 3, 2, 1].map(rating => (
            <option key={rating} value={rating}>{rating} sao</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Khóa học</th>
              <th className="p-4 text-left">Người đánh giá</th>
              <th className="p-4 text-left">Đánh giá</th>
              <th className="p-4 text-left">Số sao</th>
              <th className="p-4 text-left">Ngày đánh giá</th>
              <th className="p-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-t">
                <td className="p-4">{review.course.title}</td>
                <td className="p-4">{review.user.fullName}</td>
                <td className="p-4">{review.review}</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1">{review.rating}</span>
                  </div>
                </td>
                <td className="p-4">
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-3 py-2 border rounded-lg"
        >
          <option value={5}>5 mỗi trang</option>
          <option value={10}>10 mỗi trang</option>
          <option value={20}>20 mỗi trang</option>
          <option value={50}>50 mỗi trang</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => setPage(prev => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2">
            Trang {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewManagementPage;