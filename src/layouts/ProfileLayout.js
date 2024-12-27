import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import userService from '../services/userService'; // Make sure to import your userService

const ProfileLayout = ({ children, showHeaderFooter = true }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
            
                const fetchedUserData = await userService.getProfileUser()
                console.log(fetchUserData)
                setUserInfo(fetchedUserData);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUserData();
    }, []); // Run only once when component mounts

    return (
        <div className="flex flex-col min-h-screen">
            {showHeaderFooter && <Header className="fixed top-0 left-0 right-0 z-50 w-full" />}
            <div className="flex flex-grow pt-16"> {/* Add padding-top for content */}
                {/* Sidebar will only show if showHeaderFooter is true */}
                {showHeaderFooter && (
                    <Sidebar 
                        userName={userInfo?.fullName} 
                        userImage={userInfo?.profilePicture}
                    />
                )}
                
                <main className="flex-grow bg-gray-100">
                    <div className="container mx-auto px-4 py-6">
                        {children}
                    </div>
                </main>
            </div>
            {showHeaderFooter && <Footer />}
        </div>
    );
};

export default ProfileLayout;
