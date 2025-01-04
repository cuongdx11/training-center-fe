import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';

const InstructorSection = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await userService.getListInstructorHome();
        setInstructors(data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    if (instructors.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => 
          prev === Math.ceil(instructors.length / 3) - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [instructors]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Original Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Đội Ngũ Giảng Viên Chất Lượng
              </span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Đội ngũ giảng viên giàu kinh nghiệm, đến từ các công ty công nghệ hàng đầu
          </p>
        </div>

        {/* Improved Sliding Container */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {instructors.map((instructor) => (
              <div
                key={instructor.email}
                className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] px-4"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  {/* Fixed aspect ratio container for image */}
                  <div className="relative aspect-square">
                    <img
                      src={instructor.profilePicture}
                      alt={instructor.fullName}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src = '/images/default-avatar.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {instructor.fullName}
                    </h3>
                    <p className="text-blue-600 mb-4 font-medium">{instructor.email}</p>
                    <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                      {instructor.bio || 'Giảng viên'}
                    </p>

                    <div className="mt-6 flex space-x-4 justify-center">
                      {['Twitter', 'GitHub', 'LinkedIn'].map((platform) => (
                        <button
                          key={platform}
                          onClick={() => window.open(`https://${platform.toLowerCase()}.com`, '_blank')}
                          className="text-gray-400 hover:text-blue-600 transition-all duration-300 p-2 rounded-full hover:bg-blue-50 transform hover:scale-110"
                          aria-label={`${platform} Profile`}
                        >
                          {platform === 'Twitter' && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22.23 3.88a9.03 9.03 0 0 1-2.6.71 4.53 4.53 0 0 0 2-2.5c-.88.52-1.86.9-2.9 1.1a4.52 4.52 0 0 0-7.7 4.12 12.83 12.83 0 0 1-9.3-4.72 4.52 4.52 0 0 0 1.4 6.04 4.5 4.5 0 0 1-2.05-.57v.06a4.52 4.52 0 0 0 3.63 4.43 4.53 4.53 0 0 1-2.04.08 4.52 4.52 0 0 0 4.22 3.14 9.06 9.06 0 0 1-5.6 1.93c-.37 0-.73-.02-1.08-.06a12.78 12.78 0 0 0 6.93 2.03c8.3 0 12.85-6.87 12.85-12.84 0-.2 0-.39-.01-.59.88-.64 1.64-1.43 2.25-2.33z" />
                            </svg>
                          )}
                          {platform === 'GitHub' && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          )}
                          {platform === 'LinkedIn' && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: Math.ceil(instructors.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'w-8 bg-gradient-to-r from-blue-600 to-indigo-600' 
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;