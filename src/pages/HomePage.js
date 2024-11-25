import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Slider from '../components/home/Slider';
import FeaturedCourses from '../components/home/FeaturedCourses';
import AboutCenter from '../components/home/AboutCenter';
import UpcomingCourses from '../components/home/UpcomingCourses';
import LearningPath from '../components/home/LearningPath';
import OfflineCourses from '../components/home/OfflineCourses';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.state?.loginSuccess) {
            toast.success('Đăng nhập thành công!', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <main>
                {/* Hero Section with Slider */}
                <section className="relative w-full">
                    <Slider />
                </section>

                {/* Main Content Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* About Section */}
                    <section className="py-16">
                        <AboutCenter />
                    </section>

                    {/* Featured Courses Section */}
                    <section className="py-16">
                        <div className="mb-16">
                            <FeaturedCourses />
                        </div>
                        
                        {/* Learning Journey Section */}
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <LearningPath />
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <UpcomingCourses />
                            </div>
                        </div>
                    </section>

                    {/* Offline Courses Section */}
                    <section className="py-16">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <OfflineCourses />
                        </div>
                    </section>
                </div>
            </main>
            <ToastContainer />
        </div>
    );
};

export default HomePage;