import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const sliderData = [
        {
            image: "/slider1.jpg",
            title: "Khởi Đầu Hành Trình Lập Trình",
            description: "Từ người mới bắt đầu đến chuyên gia với lộ trình đào tạo chuyên nghiệp",
            buttonText: "Khám Phá Ngay",
            buttonLink: "/courses"
        },
        {
            image: "/slider2.jpg",
            title: "Học Từ Chuyên Gia",
            description: "Đội ngũ giảng viên với hơn 10 năm kinh nghiệm trong ngành công nghệ",
            buttonText: "Gặp Gỡ Giảng Viên",
            buttonLink: "/instructors"
        },
        {
            image: "/slider3.jpg",
            title: "Phương Pháp Học Hiện Đại",
            description: "Kết hợp lý thuyết và thực hành với các dự án thực tế",
            buttonText: "Xem Khóa Học",
            buttonLink: "/programs"
        }
    ];

    useEffect(() => {
        let timer;
        if (isAutoPlaying) {
            timer = setInterval(() => {
                setCurrentSlide((prevSlide) => 
                    prevSlide === sliderData.length - 1 ? 0 : prevSlide + 1
                );
            }, 5000);
        }
        return () => clearInterval(timer);
    }, [isAutoPlaying,sliderData.length]);

    const handleSlideChange = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => handleSlideChange(
        currentSlide === sliderData.length - 1 ? 0 : currentSlide + 1
    );

    const prevSlide = () => handleSlideChange(
        currentSlide === 0 ? sliderData.length - 1 : currentSlide - 1
    );

    return (
        <section className="relative h-[450px] overflow-hidden">
            <div className="relative w-full h-full">
                {sliderData.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute w-full h-full transition-opacity duration-1000 ${
                            currentSlide === index ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 px-4">
                            <div className="max-w-4xl mx-auto text-center">
                                <h2 className="text-5xl font-bold mb-6 transform translate-y-0 transition-transform duration-700">
                                    {slide.title}
                                </h2>
                                <p className="text-xl mb-8 opacity-90">
                                    {slide.description}
                                </p>
                                <a
                                    href={slide.buttonLink}
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
                                >
                                    {slide.buttonText}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Navigation Arrows */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition duration-300 group"
                >
                    <ChevronLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition duration-300 group"
                >
                    <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                    {sliderData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleSlideChange(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                currentSlide === index 
                                    ? 'bg-white w-8' 
                                    : 'bg-white/50 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Slider;