import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children, showHeaderFooter = true }) => {
    return (
        <div className="flex flex-col min-h-screen">
            {showHeaderFooter && <Header className="fixed top-0 left-0 right-0 z-50" />}
            <main className={`flex-grow bg-gray-100 ${showHeaderFooter ? 'pt-16' : ''}`}>
                {children}
            </main>
            {showHeaderFooter && <Footer />}
        </div>
    );
};

export default MainLayout;

