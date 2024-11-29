import React, { useState, useEffect } from 'react';
import PaymentForm from '../../components/admin/payments/PaymentForm';
import PaymentTable from '../../components/admin/payments/PaymentTable';

import {paymentService} from '../../services/paymentService';
import {orderService} from '../../services/orderService';

const PaymentManagementPage = () => {
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Dropdown data
    const [orders, setOrders] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const paymentsResponse = await paymentService.getPayments();
                setPayments(paymentsResponse);

                const ordersResponse = await orderService.getOrders();
                setOrders(ordersResponse);

                const paymentMethodsResponse = await paymentService.getPaymentMethods();
                setPaymentMethods(paymentMethodsResponse);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            }
        };

        fetchInitialData();
    }, []);

    const handleView = (payment) => {
        setSelectedPayment(payment);
        // Implement view logic (maybe open a modal)
    };

    const handleEdit = (payment) => {
        setSelectedPayment(payment);
        setIsFormOpen(true);
    };

    const handleDelete = async (payment) => {
        try {
            await paymentService.deletePayment(payment.id);
            setPayments(payments.filter(p => p.id !== payment.id));
        } catch (error) {
            console.error('Failed to delete payment:', error);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedPayment) {
                // Update existing payment
                const updatedPayment = await paymentService.updatePaymentStatus(selectedPayment.id, formData);
                setPayments(payments.map(p => p.id === selectedPayment.id ? updatedPayment.data : p));
            } else {
                // Create new payment (if backend supports this)
                const newPayment = await paymentService.createPayment(formData);
                setPayments([...payments, newPayment.data]);
            }
            
            setIsFormOpen(false);
            setSelectedPayment(null);
        } catch (error) {
            console.error('Failed to submit payment:', error);
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedPayment(null);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
                <button 
                    onClick={() => setIsFormOpen(true)} 
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                >
                    Create New Payment
                </button>
            </div>
    
            <PaymentTable 
                payments={payments} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
    
            {isFormOpen && (
                <PaymentForm 
                    initialData={selectedPayment} 
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                    orders={orders}
                    paymentMethods={paymentMethods}
                />
            )}
        </div>
    );
};

export default PaymentManagementPage;