import React from 'react';

const AdminAuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Training Center
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAuthLayout;
