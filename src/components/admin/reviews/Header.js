import React from 'react';

const Header = ({review }) => (
  <div className="flex justify-between items-center p-6 border-b">
    <h1 className="text-2xl font-bold text-gray-800">Review của khóa học: {review}</h1>
  </div>
);

export default Header;
