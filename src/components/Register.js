import React, { useState } from 'react';
import { UserCircle2, KeyRound, Mail, Eye, EyeOff, AlertCircle, Loader2, User, Phone } from 'lucide-react';
import { register } from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phoneNumber: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu không khớp!');
            return;
        }

        // Validate password strength
        if (formData.password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự!');
            return;
        }

        // Validate phone number (basic Vietnamese format)
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            setError('Số điện thoại không hợp lệ!');
            return;
        }

        setLoading(true);
        try {
            const response = await register({
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });

            if (response.status === "success") {
                setSuccess(true);
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    fullName: '',
                    phoneNumber: ''
                });
            }
        } catch (err) {
            if (err.message === "Email already exists") {
                setError('Email đã tồn tại trong hệ thống!');
            } else {
                setError('Đã có lỗi xảy ra khi đăng ký!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="px-8 pt-8 pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserCircle2 className="w-10 h-10 text-blue-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-center text-gray-900">
                            Tạo tài khoản mới
                        </h2>
                        <p className="mt-2 text-center text-gray-600">
                            Điền thông tin để bắt đầu
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 py-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name Input */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                    Họ và tên
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nguyễn Văn A"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                 placeholder-gray-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="name@example.com"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                 placeholder-gray-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Phone Number Input */}
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                    Số điện thoại
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="0912345678"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                 placeholder-gray-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                 placeholder-gray-400 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                 placeholder-gray-400 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Success Message */}
                            {success && (
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">
                                                Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg
                                          text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                          transition-colors ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        <span>Đang đăng ký...</span>
                                    </div>
                                ) : (
                                    'Đăng ký'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer Section */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                        <div className="text-center text-sm">
                            <span className="text-gray-600">Đã có tài khoản? </span>
                            <a 
                                href="/login" 
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Đăng nhập ngay
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;