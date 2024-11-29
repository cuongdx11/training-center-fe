import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const PaymentStatusBadge = ({ status }) => {
    const statusColors = {
        'PENDING': 'bg-yellow-100 text-yellow-800',
        'COMPLETED': 'bg-green-100 text-green-800',
        'FAILED': 'bg-red-100 text-red-800'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const PaymentTable = ({ payments, onView, onEdit, onDelete }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50 transition duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.order?.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.amount?.toLocaleString()} VND</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.paymentMethod?.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <PaymentStatusBadge status={payment.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                <button 
                                    onClick={() => onView(payment)} 
                                    className="text-blue-600 hover:text-blue-900 transition duration-150"
                                >
                                    <Eye size={18} />
                                </button>
                                <button 
                                    onClick={() => onEdit(payment)} 
                                    className="text-green-600 hover:text-green-900 transition duration-150"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button 
                                    onClick={() => onDelete(payment)} 
                                    className="text-red-600 hover:text-red-900 transition duration-150"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentTable;