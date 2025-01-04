import React, { useState } from 'react';
import { Pencil, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const CourseClassTable = ({ 
  courseClasses = [], 
  onEdit = () => {}, 
  onDelete = () => {},
  currentPage = 0,
  totalPages = 0,
  onPageChange = () => {},
  loading = false
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Guard clause for empty or undefined courseClasses
  if (!courseClasses || courseClasses.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        Không có dữ liệu lớp học
      </div>
    );
  }

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const renderPagination = () => {
    return (
      <div className="px-6 py-4 flex items-center justify-between border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Trang {currentPage + 1} / {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`p-2 rounded-lg ${
              currentPage === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className={`p-2 rounded-lg ${
              currentPage >= totalPages - 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khóa học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên lớp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảng viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courseClasses.map((c) => (
              <tr key={c?.id || 'no-id'} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {c?.course?.thumbnail && (
                      <img 
                        src={c.course.thumbnail} 
                        alt={c.course.title} 
                        className="w-12 h-12 rounded-md mr-3 object-cover"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {c?.course?.title || 'Không có thông tin khóa học'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {c?.course?.level || 'Chưa xác định'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{c?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{c?.instructor?.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{c?.studyTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{c?.studyDays}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    c?.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {c?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-1 hover:bg-gray-100 rounded-lg"
                      onClick={() => onEdit(c)}
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                    <button 
                      className="p-1 hover:bg-gray-100 rounded-lg"
                      onClick={() => onDelete(c?.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden">
        {courseClasses.map((c) => (
          <div key={c?.id || 'no-id'} className="bg-white mb-4 rounded-lg shadow">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleRow(c?.id)}
            >
              <div className="flex items-center space-x-3">
                {c?.course?.thumbnail && (
                  <img 
                    src={c.course.thumbnail} 
                    alt={c.course.title} 
                    className="w-12 h-12 rounded-md object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {c?.course?.title || 'Không có thông tin khóa học'}
                  </div>
                  <div className="text-sm text-gray-500">{c?.name}</div>
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  expandedRows.has(c?.id) ? 'rotate-180' : ''
                }`}
              />
            </div>
            
            {expandedRows.has(c?.id) && (
              <div className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Cấp độ:</div>
                  <div>{c?.course?.level || 'Chưa xác định'}</div>
                  <div className="text-gray-500">Giảng viên:</div>
                  <div>{c?.instructor?.fullName}</div>
                  <div className="text-gray-500">Thời gian:</div>
                  <div>{c?.studyTime}</div>
                  <div className="text-gray-500">Ngày học:</div>
                  <div>{c?.studyDays}</div>
                  <div className="text-gray-500">Trạng thái:</div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      c?.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {c?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(c);
                    }}
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(c?.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
};

export default CourseClassTable;