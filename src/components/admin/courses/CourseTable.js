import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const CourseTable = ({ courses, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khóa học</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá (VNĐ)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời lượng</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số học viên</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{course.id}</td>
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
                      <div className="text-sm text-gray-500">
                        {course?.level || 'Chưa xác định'}
                      </div>
                    </div>
                  </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{course.category?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{Number(course.price).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{course.duration} tuần</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  course.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{course.studentCount || 0}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1 hover:bg-gray-100 rounded-lg"
                    onClick={() => onEdit(course)}
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded-lg"
                    onClick={() => onDelete(course.id)}
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
  );
};

export default CourseTable;