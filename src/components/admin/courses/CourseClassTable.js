import React from 'react';
import { Pencil, Trash2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const CourseClassTable = ({ courseClass = [], onEdit = () => {}, onDelete = () => {} }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Guard clause for empty or undefined courseClass
  if (!courseClass || courseClass.length === 0) {
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

  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khóa học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên lớp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên giảng viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian mở</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courseClass.map((c) => (
              <tr key={c?.id || 'no-id'} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{c?.id}</td>
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
        {courseClass.map((c) => (
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
                  <div className="text-gray-500">ID:</div>
                  <div>{c?.id}</div>
                  <div className="text-gray-500">Cấp độ:</div>
                  <div>{c?.course?.level || 'Chưa xác định'}</div>
                  <div className="text-gray-500">Giảng viên:</div>
                  <div>{c?.instructor?.fullName}</div>
                  <div className="text-gray-500">Thời gian:</div>
                  <div>{c?.studyTime}</div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => onEdit(c)}
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => onDelete(c?.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
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

export default CourseClassTable;