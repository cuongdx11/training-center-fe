import React, { useState, useEffect } from 'react';
// import { PlusCircle } from 'lucide-react';
import CourseTable from '../../components/admin/reviews/CourseTable';
import SearchBar from '../../components/admin/reviews/SearchBar';
import { getCourses } from '../../services/coursesService';
import { getCategories } from '../../services/categoryService';
import { useNavigate } from 'react-router-dom';

const ReviewManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [coursesResponse] = await Promise.all([
        getCourses(),
        getCategories(),
      ]);
      
      setCourses(coursesResponse);
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

  const onViewReview = async (courseId) => {
    console.log("Navigating to course review with ID:", courseId);
    navigate(`${courseId}`);
  }

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
      <SearchBar value={searchTerm} onChange={handleSearch} />
      <CourseTable
        courses={filteredCourses}
        onViewReview={onViewReview}
      />

    </div>
  );
};

export default ReviewManagementPage;
