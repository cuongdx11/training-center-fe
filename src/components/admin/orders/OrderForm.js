import React, { useState } from 'react';
import { X } from 'lucide-react'; // Import close icon

const OrderForm = ({ initialData, onSubmit, onClose, paymentMethods, users, courses }) => {
    const [formData, setFormData] = useState(initialData || {
      userId: '',
      paymentMethodId: '',
      items: [{ courseId: '', price: '' }],
      notes: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleItemChange = (index, e) => {
      const { name, value } = e.target;
      const newItems = [...formData.items];
      newItems[index][name] = value;
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    };
  
    const addOrderItem = () => {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { courseId: '', price: '' }]
      }));
    };
  
    const removeOrderItem = (index) => {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-full p-2 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Create New Order</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">User</label>
                <select 
                  name="userId" 
                  value={formData.userId} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <select 
                  name="paymentMethodId" 
                  value={formData.paymentMethodId} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>{method.name}</option>
                  ))}
                </select>
              </div>
            </div>
  
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-700">Order Items</label>
                <button 
                  type="button" 
                  onClick={addOrderItem}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition duration-200"
                >
                  Add Item
                </button>
              </div>
              {formData.items.map((item, index) => (
                <div key={index} className="grid md:grid-cols-3 gap-4 mb-4 items-center">
                  <select 
                    name="courseId"
                    value={item.courseId}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    name="price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeOrderItem(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
  
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                rows="4"
                placeholder="Additional notes for this order..."
              />
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
                Save Order
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default OrderForm;