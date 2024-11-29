// src/OrderManagementPage/OrderModal.js
import React from 'react';

const OrderModal = ({ isOpen, onClose, order }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">User</p>
              <p className="font-medium">{order.user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">{order.totalAmount.toLocaleString()} VND</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'}
              `}>
                {order.status}
              </span>
            </div>
          </div>
  
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Course</th>
                  <th className="p-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.course.title}</td>
                    <td className="p-2 text-right">{item.price.toLocaleString()} VND</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          <div className="mt-6 text-center">
            <button 
              onClick={onClose} 
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

export default OrderModal;