
import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const HomePage = () => {
    useEffect(() => {
        // Kiểm tra xem có thông báo đăng nhập thành công không
        const loginSuccess = localStorage.getItem('loginSuccess');
        if (loginSuccess) {
            toast.success('Đăng nhập thành công!', {
                position: "top-center",
                autoClose: 2000,
            });
            // Xóa flag sau khi đã hiển thị thông báo
            setTimeout(() => {
                localStorage.removeItem('loginSuccess');
            }, 2000);
        }
    }, []);
    return (
        <div>
            <main className="bg-gray-100">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                    <div className="container mx-auto text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Chào Mừng Đến Với Trung Tâm Đào Tạo Lập Trình
                        </h1>
                        <p className="text-lg md:text-xl mb-8">
                            Khám phá các khóa học lập trình chất lượng và nâng cao kỹ năng của bạn!
                        </p>
                        <a
                            href="/courses"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-100 transition duration-200 inline-block"
                        >
                            Xem Khóa Học
                        </a>
                    </div>
                </section>

                {/* Featured Courses Section */}
                <section className="container mx-auto py-16 px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Các Khóa Học Nổi Bật</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Course Card 1 */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
                            <img
                                src="/course-web.jpg"
                                alt="Web Development"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">Lập Trình Web</h3>
                                <p className="text-gray-600 mb-4">
                                    Học cách xây dựng website chuyên nghiệp từ A đến Z.
                                </p>
                                <a
                                    href="/courses/web-development"
                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                    Tìm Hiểu Thêm →
                                </a>
                            </div>
                        </div>

                        {/* Course Card 2 */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
                            <img
                                src="/course-python.jpg"
                                alt="Python Programming"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">Lập Trình Python</h3>
                                <p className="text-gray-600 mb-4">
                                    Tìm hiểu lập trình Python từ cơ bản đến nâng cao.
                                </p>
                                <a
                                    href="/courses/python"
                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                    Tìm Hiểu Thêm →
                                </a>
                            </div>
                        </div>

                        {/* Course Card 3 */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
                            <img
                                src="/course-react.jpg"
                                alt="React Development"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">Lập Trình ReactJS</h3>
                                <p className="text-gray-600 mb-4">
                                    Khám phá lập trình ReactJS và phát triển ứng dụng động.
                                </p>
                                <a
                                    href="/courses/react"
                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                    Tìm Hiểu Thêm →
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <ToastContainer />
        </div>
    );
};

export default HomePage;