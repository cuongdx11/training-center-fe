import React, { useState } from 'react';
import { login as loginService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle2, KeyRound, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await loginService({ email, password });
            const userData = {
                id: response.data.userId,
                email: email,
                profilePicture: response.data.profilePicture,
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken
            };

            authLogin(userData);
            
            const loginEvent = new Event('userLogin');
            window.dispatchEvent(loginEvent);
            
            navigate('/', { state: { loginSuccess: true } });

        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
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
                            Chào mừng trở lại
                        </h2>
                        <p className="mt-2 text-center text-gray-600">
                            Đăng nhập vào tài khoản của bạn
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 py-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserCircle2 className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="name@example.com"
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
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                 placeholder-gray-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
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
                                        <span>Đang đăng nhập...</span>
                                    </div>
                                ) : (
                                    'Đăng nhập'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer Section */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 text-gray-500">hoặc</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600">Chưa có tài khoản? </span>
                            <a 
                                href="/register" 
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Đăng ký ngay
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;