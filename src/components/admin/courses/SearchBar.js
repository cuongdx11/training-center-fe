import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ onSearch, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: '',
    category: '',
    level: ''
  });

  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const priceRanges = [
    { label: 'Dưới 1.000.000đ', value: '0-1000000' },
    { label: '1.000.000đ - 3.000.000đ', value: '1000000-3000000' },
    { label: '3.000.000đ - 5.000.000đ', value: '3000000-5000000' },
    { label: 'Trên 5.000.000đ', value: '5000000-999999999' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
  
    const searchParams = {
      keys: [],
      operations: [],
      values: [],
    };
  
    // Thêm điều kiện tìm kiếm từ khoá
    if (searchTerm) {
      searchParams.keys.push('title');
      searchParams.operations.push(':');
      searchParams.values.push(searchTerm);
  
      // searchParams.keys.push('description');
      // searchParams.operations.push(':');
      // searchParams.values.push(searchTerm);
    }
  
    // Thêm bộ lọc theo danh mục
    if (filters.category) {
      searchParams.keys.push('category.id');
      searchParams.operations.push('=');
      searchParams.values.push(filters.category);
    }
  
    // Thêm bộ lọc theo cấp độ
    if (filters.level) {
      searchParams.keys.push('level');
      searchParams.operations.push('=');
      searchParams.values.push(filters.level);
    }
  
    // Thêm bộ lọc khoảng giá
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-');
      searchParams.keys.push('price');
      searchParams.operations.push('>=');
      searchParams.values.push(min);
  
      searchParams.keys.push('price');
      searchParams.operations.push('<=');
      searchParams.values.push(max);
    }
  
    onSearch(searchParams);
  };
  

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học theo tên hoặc mô tả..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      </form>

      {showFilters && (
        <div className="p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cấp độ
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            >
              <option value="">Tất cả cấp độ</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khoảng giá
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            >
              <option value="">Tất cả mức giá</option>
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;