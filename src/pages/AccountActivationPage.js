import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import  {activateUser}  from '../services/authService';
import { CheckCircle, XCircle } from 'lucide-react';

const AccountActivation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const token = searchParams.get('token');

  useEffect(() => {
    const activateAccount = async () => {
      try {
        if (!token) {
          setStatus('error');
          return;
        }

        await activateUser(token);
        setStatus('success');
        
        // Tự động chuyển về trang login sau 5 giây
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (error) {
        setStatus('error');
      }
    };

    activateAccount();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="animate-pulse w-16 h-16 bg-blue-100 rounded-full mx-auto"></div>
            <h2 className="text-2xl font-bold text-gray-900">Đang xác thực tài khoản...</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Kích hoạt tài khoản thành công!</h2>
            <p className="text-gray-600">
              Tài khoản của bạn đã được kích hoạt thành công. Bạn sẽ được chuyển đến trang đăng nhập trong 5 giây.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Kích hoạt tài khoản thất bại</h2>
            <p className="text-gray-600">
              Link kích hoạt không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại email hoặc liên hệ hỗ trợ.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/register')}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Đăng ký lại
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Liên hệ hỗ trợ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountActivation;