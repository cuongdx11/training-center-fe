import React from 'react';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Modal;
