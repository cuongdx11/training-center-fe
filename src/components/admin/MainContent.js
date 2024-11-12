import React from 'react';
import { Outlet } from 'react-router-dom';

const MainContent = () => {
  return (
    <div className="pt-20 p-6">
      <Outlet />
    </div>
  );
};

export default MainContent;
