import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const FilterClass = ({ onSearch, courses, instructors }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    className: '',
    courseId: '',
    instructorId: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      className: '',
      courseId: '',
      instructorId: ''
    });
    onSearch({
      className: '',
      courseId: '',
      instructorId: ''
    });
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên lớp học..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={filters.className}
            onChange={(e) => setFilters({ ...filters, className: e.target.value })}
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          Bộ lọc
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Tìm kiếm
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Đặt lại
        </button>
      </form>

      {showFilters && (
        <div className="p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khóa học
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.courseId}
              onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
            >
              <option value="">Tất cả khóa học</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giảng viên
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.instructorId}
              onChange={(e) => setFilters({ ...filters, instructorId: e.target.value })}
            >
              <option value="">Tất cả giảng viên</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterClass;