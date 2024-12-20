import React, { useState } from 'react';
import { Trash2, Pencil, ChevronDown } from 'lucide-react';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
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

      {/* Mobile view */}
      <div className="lg:hidden">
        {categories.map((category) => (
          <div key={category.id} className="bg-white mb-4 rounded-lg shadow">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleRow(category.id)}
            >
              <div>
                <div className="font-medium text-gray-900">{category.name}</div>
                <div className="text-sm text-gray-500">{category.type}</div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  expandedRows.has(category.id) ? 'rotate-180' : ''
                }`}
              />
            </div>
            {expandedRows.has(category.id) && (
              <div className="px-4 pb-4 space-y-3">
                <div className="text-sm">
                  <div className="text-gray-500">ID:</div>
                  <div>{category.id}</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500">Mô tả:</div>
                  <div>{category.description || 'Không có mô tả'}</div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => onEdit(category.id)}
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => onDelete(category.id)}
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

export default CategoryTable;
