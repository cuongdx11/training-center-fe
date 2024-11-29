import React, { useState, useEffect } from 'react';
import OrderForm from '../../components/admin/orders/OrderForm';
import OrderTable from '../../components/admin/orders/OrderTable';
import OrderModal from '../../components/admin/orders/OrderModal';

import {orderService} from '../../services/orderService';
import {paymentService} from '../../services/paymentService';
import userService from '../../services/userService';
import {getCourses} from '../../services/coursesService';

const OrderManagementPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
  
    // State for dropdown data
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch orders
                const ordersResponse = await orderService.getOrders();
                setOrders(ordersResponse);

                // Fetch payment methods
                const paymentMethodsResponse = await paymentService.getPaymentMethods();
                setPaymentMethods(paymentMethodsResponse);

                // Fetch users
                const usersResponse = await userService.getAllUsers();
                setUsers(usersResponse);

                // Fetch courses
                const coursesResponse = await getCourses()
                setCourses(coursesResponse);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            }
        };

        fetchInitialData();
    }, []);
  
    const handleView = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };
  
    const handleEdit = (order) => {
        setSelectedOrder(order);
        setIsFormOpen(true);
    };
  
    const handleDelete = async (order) => {
        try {
            await orderService.deleteOrder(order.id);
            setOrders(orders.filter(o => o.id !== order.id));
        } catch (error) {
            console.error('Failed to delete order:', error);
        }
    };
  
    const handleSubmit = async (formData) => {
        try {
            if (selectedOrder) {
                // Update existing order
                const updatedOrder = await orderService.updateOrder(selectedOrder.id, formData);
                setOrders(orders.map(o => o.id === selectedOrder.id ? updatedOrder.data : o));
            } else {
                // Create new order
                const newOrder = await orderService.createOrder(formData);
                setOrders([...orders, newOrder.data]);
            }
            
            setIsFormOpen(false);
            setSelectedOrder(null);
        } catch (error) {
            console.error('Failed to submit order:', error);
        }
    };
  
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedOrder(null);
    };
  
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                <button 
                    onClick={() => setIsFormOpen(true)} 
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                >
                    Create New Order
                </button>
            </div>
    
            <OrderTable 
                orders={orders} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
    
            {isModalOpen && (
                <OrderModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    order={selectedOrder} 
                />
            )}
    
            {isFormOpen && (
                <OrderForm 
                    initialData={selectedOrder} 
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                    paymentMethods={paymentMethods}
                    users={users}
                    courses={courses}
                />
            )}
        </div>
    );
};

export default OrderManagementPage;