import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createNotification } from '../../../services/notificationService';

// Import các icons cần thiết
import { AlertCircle, CheckCircle } from 'lucide-react';

const CreateNotificationForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Danh sách các loại thông báo
    const notificationTypes = [
        'SYSTEM',  'ADMIN', 
        'INSTRUCTOR', 'STUDENT'
    ];

    // Danh sách trạng thái thông báo
    const notificationStatuses = ['ACTIVE', 'ARCHIVED'];

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
           

            // Chuẩn bị dữ liệu request
            const notificationData = {
                ...data 
            };

            // Gọi API tạo thông báo
            await createNotification(notificationData);
            
            setSubmitStatus({
                type: 'success',
                message: 'Thông báo đã được tạo thành công!'
            });

            // Reset form sau khi submit
            reset();
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo thông báo'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Tạo Thông Báo Mới</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Tiêu đề */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề
                    </label>
                    <input 
                        type="text" 
                        {...register('title', { 
                            required: 'Tiêu đề không được để trống',
                            maxLength: {
                                value: 255,
                                message: 'Tiêu đề không được vượt quá 255 ký tự'
                            }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tiêu đề thông báo"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Nội dung */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung
                    </label>
                    <textarea 
                        {...register('message', { 
                            required: 'Nội dung không được để trống',
                            maxLength: {
                                value: 1000,
                                message: 'Nội dung không được vượt quá 1000 ký tự'
                            }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Nhập nội dung thông báo"
                    ></textarea>
                    {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                </div>

                {/* Loại thông báo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại Thông Báo
                    </label>
                    <select 
                        {...register('type', { required: 'Vui lòng chọn loại thông báo' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Chọn loại thông báo</option>
                        {notificationTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.type && (
                        <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                    )}
                </div>

                {/* Trạng thái */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng Thái
                    </label>
                    <select 
                        {...register('status', { required: 'Vui lòng chọn trạng thái' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Chọn trạng thái</option>
                        {notificationStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    {errors.status && (
                        <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                    )}
                </div>

                {/* Nút submit */}
                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-md text-white font-semibold transition-colors 
                            ${isSubmitting 
                                ? 'bg-blue-300 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Tạo Thông Báo'}
                    </button>
                </div>

                {/* Thông báo trạng thái */}
                {submitStatus && (
                    <div className={`
                        flex items-center p-4 rounded-md mt-4
                        ${submitStatus.type === 'success' 
                            ? 'bg-green-50 text-green-800' 
                            : 'bg-red-50 text-red-800'
                        }
                    `}>
                        {submitStatus.type === 'success' 
                            ? <CheckCircle className="mr-2 w-6 h-6" /> 
                            : <AlertCircle className="mr-2 w-6 h-6" />
                        }
                        {submitStatus.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateNotificationForm;
