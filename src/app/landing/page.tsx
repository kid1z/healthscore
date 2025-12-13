'use client'; 
// Bắt buộc phải có chỉ thị này vì component sử dụng React Hooks và tương tác (Link)

import React from 'react';
import Link from 'next/link';


// =================================================================
//                 1. COMPONENT THANH ĐIỀU HƯỚNG DƯỚI (NAVBAR)
// =================================================================

const BottomNavbar: React.FC = () => {
    // Component này mô phỏng thanh điều hướng cố định dưới cùng
    return (
        // Sử dụng fixed và max-w-lg để mô phỏng giao diện mobile
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t border-gray-200 p-4 max-w-lg mx-auto z-10">
            <div className="flex justify-around items-center">
                {/* Home */}
                <NavItem icon="🏠" label="Home" isActive={true} href="/landing" />
                
                {/* Camera (Nút trung tâm) */}
                <div className="relative -top-6">
                    <button className="bg-gray-900 text-white rounded-full p-4 shadow-2xl hover:bg-gray-700 transition-colors">
                        {/* Icon Camera hoặc Scan */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.808-1.212A2 2 0 0110.424 4h3.152a2 2 0 011.664.89l.808 1.212a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
                
                {/* Coach */}
                <NavItem icon="🌿" label="Coach" isActive={false} href="/coach" />
            </div>
        </nav>
    );
};

interface NavItemProps {
    icon: string;
    label: string;
    isActive: boolean;
    href: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, href }) => (
    // Link là thẻ <a> trong Next.js
    <Link href={href} className="text-center transition-colors">
        <span className={`text-xl ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>{icon}</span>
        <p className={`text-xs font-medium ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>{label}</p>
    </Link>
);


// =================================================================
//                 2. COMPONENT CHÍNH (LANDING PAGE)
// =================================================================

export default function LandingPage() {
    return (
        // Khung màn hình giả lập mobile
        <div className="min-h-screen bg-white flex flex-col items-center justify-between p-6 max-w-lg mx-auto">
            
            {/* Vùng nội dung chính */}
            <div className="flex flex-col items-center text-center mt-12 mb-20">
                
                {/* Ảnh minh họa (Placeholder) */}
                <div className="w-64 h-64 mb-8 bg-gray-100 rounded-3xl overflow-hidden shadow-lg flex items-center justify-center">
                    {/*  */}
                    <img
                        src="/uploads/WavingGirl.gif" // Thay thế bằng đường dẫn ảnh thật (nên đặt trong thư mục public)
                        alt="hero"
                        // Styling để mô phỏng ảnh trong khung
                        className="w-full h-full object-cover" 
                    />
                </div>

                {/* Tiêu đề và Mô tả */}
                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                    Go see the new thing with <span className="text-green-500">CyberHealth</span> <span className="text-red-500">♥</span>
                </h1>
                
                <p className="text-lg text-gray-500 mb-12 max-w-xs">
                    Your personal AI Body Guard. <br/>
                    Simple. Smart. Clean.
                </p>

                {/* Nút Get Started */}
                <Link href="/bio">
                    <button className="flex items-center justify-center bg-green-500 text-white text-lg font-semibold py-4 px-12 rounded-full shadow-lg shadow-green-500/50 hover:bg-green-600 transition-colors transform hover:scale-105">
                        Get Started →
                    </button>
                </Link>
            </div>
            
            {/* Thanh điều hướng dưới cùng */}
            <BottomNavbar />

            {/* Tạo khoảng trống ở cuối để Navbar không bị che mất nội dung */}
            <div className="h-20"></div> 
        </div>
    );
}