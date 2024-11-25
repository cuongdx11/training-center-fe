import React from 'react';
import { ChevronRight } from 'lucide-react';

const CourseCard = ({ image, title, description, link }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl group">
            <div className="relative overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <a
                    href={link}
                    className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center group"
                >
                    <span>Tìm Hiểu Thêm</span>
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </div>
    );
};

export default CourseCard;