import React from 'react';
import { Trash2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const CourseReviewTable = ({ courseReviews, onDelete }) => {
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
                Tên người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số sao
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courseReviews.map((courseReview) => (
              <tr key={courseReview.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{courseReview.user?.fullName || 'Không có tên'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{courseReview.review || 'Không có nội dung'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{courseReview.rating || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="p-1 hover:bg-gray-100 rounded-lg"
                    onClick={() => onDelete(courseReview.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden">
        {courseReviews.map((courseReview) => (
          <div key={courseReview.id} className="bg-white mb-4 rounded-lg shadow">
            <div
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleRow(courseReview.id)}
            >
              <div>
                <div className="font-medium text-gray-900">{courseReview.user?.fullName || 'Không có tên'}</div>
                <div className="text-sm text-gray-500">
                  {courseReview.rating ? `${courseReview.rating} sao` : 'Không có đánh giá'}
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  expandedRows.has(courseReview.id) ? 'rotate-180' : ''
                }`}
              />
            </div>
            {expandedRows.has(courseReview.id) && (
              <div className="px-4 pb-4 space-y-3">
                <div className="text-sm text-gray-500">Nội dung comment:</div>
                <div className="text-gray-900">{courseReview.review || 'Không có nội dung'}</div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => onDelete(courseReview.id)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
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

export default CourseReviewTable;
