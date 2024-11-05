import React, { useState } from 'react';
import { login as loginService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

            // Sử dụng context login thay vì lưu trực tiếp vào localStorage
            authLogin(userData);

            // Dispatch login event nếu cần
            const loginEvent = new Event('userLogin');
            window.dispatchEvent(loginEvent);
            
            // Chuyển hướng sau khi đăng nhập thành công
            navigate('/');

        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96 max-w-md space-y-8">
                <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật Khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-center text-sm">{error}</div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Đăng ký ngay
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;