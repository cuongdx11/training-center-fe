import React, { useState } from 'react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Kiểm tra mật khẩu và xác nhận mật khẩu
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }
        // Xử lý đăng ký ở đây
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-8 w-96 mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật Khẩu</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác Nhận Mật Khẩu</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Đăng Ký
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Đã có tài khoản? <a href="/login" className="text-blue-600 hover:underline">Đăng nhập ngay</a>
            </p>
        </div>
    );
};

export default Register;
