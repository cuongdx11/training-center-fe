import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer = null,
    size = 'md' 
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div 
                className="fixed inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>
            
            <div className={`
                relative w-full ${sizeClasses[size]} 
                mx-auto my-6 
                bg-white rounded-lg shadow-xl
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 rounded-t">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="relative p-6 flex-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;