import React from 'react';
import { Trash2 } from 'lucide-react';

const CourseReviewTable = ({ courseReviews, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên người dùng</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung comment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số sao</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courseReviews.map((courseReview) => (
            <tr key={courseReview.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{courseReview.user?.fullName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{courseReview.review}</td>
              <td className="px-6 py-4 whitespace-nowrap">{courseReview.rating}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1 hover:bg-gray-100 rounded-lg"
                    onClick={() => onDelete(courseReview.id)}
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

export default CourseReviewTable;