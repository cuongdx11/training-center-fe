// src/OrderManagementPage/OrderTable.js
import React from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';

const OrderTable = ({ orders, onView, onEdit, onDelete }) => {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 whitespace-nowrap">{order.id}</td>
                <td className="p-3 whitespace-nowrap">{order.user.fullName}</td>
                <td className="p-3 whitespace-nowrap">{order.totalAmount.toLocaleString()} VND</td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}
                  `}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap flex space-x-2">
                  <button 
                    onClick={() => onView(order)} 
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Eye size={20} />
                  </button>
                  <button 
                    onClick={() => onEdit(order)} 
                    className="text-green-500 hover:text-green-700"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => onDelete(order)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default OrderTable;