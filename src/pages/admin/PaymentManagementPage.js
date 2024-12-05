import React, { useState, useEffect } from 'react';
import PaymentForm from '../../components/admin/payments/PaymentForm';
import PaymentTable from '../../components/admin/payments/PaymentTable';

import {paymentService} from '../../services/paymentService';
import {orderService} from '../../services/orderService';

const PaymentManagementPage = () => {
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [viewMode, setViewMode] = useState(null); // 'view' or 'edit'

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
        setViewMode('view');
    };

    const handleEdit = (payment) => {
        setSelectedPayment(payment);
        setViewMode('edit');
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
                // Only allow status update when in edit mode
                const updatedPayment = await paymentService.updatePaymentStatus(selectedPayment.id, {
                    status: formData.status
                });
                setPayments(payments.map(p => p.id === selectedPayment.id ? updatedPayment.data : p));
            }
            
            // Reset view and selection
            setViewMode(null);
            setSelectedPayment(null);
        } catch (error) {
            console.error('Failed to submit payment:', error);
        }
    };

    const handleCloseForm = () => {
        setViewMode(null);
        setSelectedPayment(null);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
            </div>
    
            <PaymentTable 
                payments={payments} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
    
            {viewMode === 'view' && selectedPayment && (
                <PaymentForm 
                    payment={selectedPayment} 
                    onClose={handleCloseForm}
                    readOnly={true}
                />
            )}

            {viewMode === 'edit' && selectedPayment && (
                <PaymentForm 
                    payment={selectedPayment} 
                    onClose={handleCloseForm}
                    onSubmit={handleSubmit}
                    editStatusOnly={true}
                />
            )}
        </div>
    );
};

export default PaymentManagementPage;