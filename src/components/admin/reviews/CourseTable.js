import React from 'react';
import { Eye, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const CourseTable = ({ courses, onViewReview }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên khóa học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá (VNĐ)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số học viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  <div className="flex items-center">
                    {course?.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-12 h-12 rounded-md mr-3 object-cover"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {course?.title || 'Không có thông tin khóa học'}
                      </div>
                      <div className="text-sm text-gray-500">{course?.level || 'Chưa xác định'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{course.category?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{Number(course.price).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.duration} tuần</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      course.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{course.studentCount || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="p-1 hover:bg-gray-100 rounded-lg"
                    onClick={() => onViewReview(course.id)}
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden">
        {courses.map((course) => (
          <div key={course.id} className="bg-white mb-4 rounded-lg shadow">
            <div
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleRow(course.id)}
            >
              <div className="flex items-center space-x-3">
                {course?.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {course?.title || 'Không có thông tin khóa học'}
                  </div>
                  <div className="text-sm text-gray-500">{course?.category?.name || 'Không có danh mục'}</div>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  expandedRows.has(course.id) ? 'rotate-180' : ''
                }`}
              />
            </div>
            {expandedRows.has(course.id) && (
              <div className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Giá:</div>
                  <div>{Number(course.price).toLocaleString()} VNĐ</div>
                  <div className="text-gray-500">Thời lượng:</div>
                  <div>{course.duration} tuần</div>
                  <div className="text-gray-500">Trạng thái:</div>
                  <div>{course.status === 'active' ? 'Đang mở' : 'Đã đóng'}</div>
                  <div className="text-gray-500">Số học viên:</div>
                  <div>{course.studentCount || 0}</div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => onViewReview(course.id)}
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseTable;
