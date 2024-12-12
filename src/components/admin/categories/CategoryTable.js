import React from 'react';
import { Trash2, Pencil } from 'lucide-react';

const CategoryTable = ({ categories, onEdit, onDelete}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Danh mục</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              {/* <td className="px-6 py-4 whitespace-nowrap">{course.id}</td> */}
              <td className="px-6 py-4 whitespace-nowrap">{category.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{category.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">{category.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1 hover:bg-gray-100 rounded-lg"
                    onClick={() => onEdit(category.id)}
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded-lg"
                    onClick={() => onDelete(category.id)}
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

export default CategoryTable;