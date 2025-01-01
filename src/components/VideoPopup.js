import React from 'react';
import {  X } from 'lucide-react';

const VideoPopup = ({ isVisible, onClose, videoLink }) => {
  if (!isVisible) return null;

  // Prevent click inside video from closing popup
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg overflow-hidden shadow-lg w-11/12 max-w-4xl m-4"
        onClick={handleContentClick}
      >
        <button
          className="absolute top-4 right-4 p-1 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
          onClick={onClose}
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="aspect-video w-full">
          {videoLink ? (
            <video
              src={videoLink}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              Video không khả dụng.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;