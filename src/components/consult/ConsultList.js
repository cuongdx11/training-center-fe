import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllConsults } from '../../services/consultService';

const ConsultList = () => {
  const navigate = useNavigate();
  const [consults, setConsults] = useState([]);
  const [filteredConsults, setFilteredConsults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchConsults = useCallback(async () => {
    try {
      const data = await getAllConsults();
      setConsults(data);
      setFilteredConsults(data);
    } catch (error) {
      console.error('Error fetching consults:', error);
    }
  }, []);

  const filterConsults = useCallback(() => {
    let filtered = consults;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(consult => consult.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(consult =>
        consult.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consult.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consult.phoneNumber.includes(searchTerm)
      );
    }

    setFilteredConsults(filtered);
  }, [consults, statusFilter, searchTerm]);

  useEffect(() => {
    fetchConsults();
  }, [fetchConsults]);

  useEffect(() => {
    filterConsults();
  }, [filterConsults]);

  // Rest of the component remains the same...
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {status === 'PENDING' ? 'Chờ xử lý' : 
         status === 'IN_PROGRESS' ? 'Đang xử lý' : 'Hoàn thành'}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Danh sách yêu cầu tư vấn</h2>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="IN_PROGRESS">Đang xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConsults.map((consult) => (
                  <tr 
                    key={consult.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/consults/${consult.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{consult.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{consult.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{consult.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(consult.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(consult.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultList;