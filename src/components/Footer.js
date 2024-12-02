import React from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Thông tin về trung tâm */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Trung Tâm Đào Tạo Lập Trình</h3>
                        <p className="text-gray-200">Đào tạo lập trình viên chuyên nghiệp với chương trình cập nhật và thực tiễn</p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com/trungtam" aria-label="Facebook" className="hover:text-blue-300 transition-colors">
                                <Facebook size={24} />
                            </a>
                            <a href="https://instagram.com/trungtam" aria-label="Instagram" className="hover:text-blue-300 transition-colors">
                                <Instagram size={24} />
                            </a>
                            <a href="https://youtube.com/trungtam" aria-label="Youtube" className="hover:text-blue-300 transition-colors">
                                <Youtube size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Khóa học */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Khóa Học</h3>
                        <ul className="space-y-2">
                            <li><a href="/courses/frontend" className="hover:text-blue-300 transition-colors">Lập Trình Web Frontend</a></li>
                            <li><a href="/courses/backend" className="hover:text-blue-300 transition-colors">Lập Trình Web Backend</a></li>
                            <li><a href="/courses/mobile" className="hover:text-blue-300 transition-colors">Lập Trình Mobile</a></li>
                            <li><a href="/courses/devops" className="hover:text-blue-300 transition-colors">DevOps</a></li>
                        </ul>
                    </div>

                    {/* Liên hệ */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Liên Hệ</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2">
                                <Phone size={16} />
                                <a href="tel:0123456789">0123 456 789</a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail size={16} />
                                <a href="mailto:contact@trungtam.com">contact@trungtam.com</a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin size={16} />
                                <a href="https://maps.google.com/?q=123+Đường+ABC,+Quận+XYZ,+TP.HCM" target="_blank" rel="noopener noreferrer">
                                    123 Đường Nguyễn Trãi, Quận Thanh Xuân, TP.HN
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Hỗ trợ */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Hỗ Trợ</h3>
                        <ul className="space-y-2">
                            <li><a href="/support/faq" className="hover:text-blue-300 transition-colors">FAQ</a></li>
                            <li><a href="/support/policy" className="hover:text-blue-300 transition-colors">Chính sách học tập</a></li>
                            <li><a href="/support/payment" className="hover:text-blue-300 transition-colors">Hướng dẫn thanh toán</a></li>
                            <li><a href="/support/consulting" className="hover:text-blue-300 transition-colors">Tư vấn học tập</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-blue-500 mt-8 pt-6 text-center">
                    <p className="text-sm text-gray-300">
                        &copy; {new Date().getFullYear()} Trung Tâm Đào Tạo Lập Trình. Tất cả quyền được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;