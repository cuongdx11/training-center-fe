import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConsultById, updateConsults } from '../../services/consultService';

const ConsultDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consult, setConsult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchConsultDetail = useCallback(async () => {
    try {
      const data = await getConsultById(id);
      setConsult(data);
    } catch (error) {
      console.error('Error fetching consult details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchConsultDetail();
  }, [fetchConsultDetail]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await updateConsults(consult.id, { status: newStatus });
      await fetchConsultDetail(); 
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!consult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Không tìm thấy thông tin tư vấn</p>
        <button
          onClick={() => navigate('/consults')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Chi tiết yêu cầu tư vấn</h2>
          <button
            onClick={() => navigate('/admin/consults')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Quay lại
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Họ tên</label>
              <p className="text-gray-900">{consult.fullName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="text-gray-900">{consult.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
              <p className="text-gray-900">{consult.phoneNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Ngày yêu cầu</label>
              <p className="text-gray-900">
                {new Date(consult.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nội dung yêu cầu</label>
            <p className="text-gray-900 whitespace-pre-wrap">{consult.requestMessage}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Trạng thái</label>
            <div className="flex gap-3">
              {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || consult.status === status}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${consult.status === status
                      ? 'bg-blue-100 text-blue-800 cursor-default'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }
                    ${updating ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {status === 'PENDING' ? 'Chờ xử lý' :
                   status === 'IN_PROGRESS' ? 'Đang xử lý' : 'Hoàn thành'}
                </button>
              ))}
            </div>
          </div>

          {consult.consultant && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Người phụ trách</label>
              <p className="text-gray-900">{consult.consultant.fullName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultDetail;