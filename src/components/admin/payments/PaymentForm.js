import React, { useState } from 'react';
import { X } from 'lucide-react';

const PaymentForm = ({ 
    initialData, 
    onSubmit, 
    onClose, 
    paymentMethods, 
    orders 
}) => {
    const [formData, setFormData] = useState(initialData || {
        orderId: '',
        amount: '',
        paymentMethodId: '',
        status: 'PENDING'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-full p-2 hover:bg-gray-100"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>

                <form onSubmit={handleSubmit} className="space-y-6 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                        {initialData ? 'Edit Payment' : 'Create New Payment'}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                            <select 
                                name="orderId"
                                value={formData.orderId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Order</option>
                                {orders.map(order => (
                                    <option key={order.id} value={order.id}>
                                        {order.id}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                            <select 
                                name="paymentMethodId"
                                value={formData.paymentMethodId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Payment Method</option>
                                {paymentMethods.map(method => (
                                    <option key={method.id} value={method.id}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                            <input 
                                type="number" 
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter payment amount"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select 
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="FAILED">Failed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                        >
                            Save Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;