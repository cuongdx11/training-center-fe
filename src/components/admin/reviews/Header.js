import React from 'react';
import { PlusCircle } from 'lucide-react';

const Header = ({ onAddClick, review }) => (
  <div className="flex justify-between items-center p-6 border-b">
    <h1 className="text-2xl font-bold text-gray-800">Review của khóa học: {review}</h1>
    <button onClick={onAddClick} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      <PlusCircle className="w-4 h-4" />
      Thêm Comment mới
    </button>
  </div>
);

export default Header;
