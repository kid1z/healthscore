"use client"; // <-- KHẮC PHỤC LỖI BUILD: Cho phép sử dụng hooks (useState, useEffect)

import React, { useState, useEffect } from 'react';
import { Droplet, TriangleAlert, Utensils, X, CheckCircle } from "lucide-react";
import type { ReactNode } from "react";

// --- 0. Định nghĩa Input Data Interface và Mock Data ---
interface CoachData {
  netEnergy: number; 
  lastLog: string; 
  steps: number; 
  kcalLeft: number; 
}

// Giả lập dữ liệu đầu vào
const MOCK_DATA: CoachData = {
  netEnergy: -100, 
  lastLog: "Latte and a small Cake", 
  steps: 4500, 
  kcalLeft: 650, 
};

// --- Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

const SimpleModal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-md">
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <h3 className="font-bold text-xl">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {children}
        <button 
          onClick={onClose} 
          className="mt-4 w-full rounded-lg bg-green-500 p-2 text-white font-semibold hover:bg-green-600"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

// --- Suggestion Card Component ---
interface SuggestionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accent: string;
  onClick: () => void;
}

function SuggestionCard({ icon, title, description, accent, onClick }: SuggestionCardProps) {
  return (
    <div
      className={`flex items-start rounded-2xl border-l-4 bg-white p-4 shadow-sm transition duration-150 hover:shadow-lg cursor-pointer ${accent}`}
      onClick={onClick}
    >
      <div className="mr-3 text-xl">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      
    </div>
  );
}

// --- Component Trang chính (CoachPage) ---
export default function CoachPage() {
  const [data, setData] = useState<CoachData>(MOCK_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', detail: '' });

  // 1. Hàm updateCoachUI (Logic Client)
  useEffect(() => {
    // Logic fetch data thực tế sẽ diễn ra ở đây.
    // Hàm này chạy mỗi khi component mount (mở tab).
    console.log("updateCoachUI() triggered on component mount.");
  }, []);

  // Hàm mở Modal
  const openModal = (title: string, detail: string) => {
    setModalContent({ title, detail });
    setIsModalOpen(true);
  };
  
  // Hàm đóng Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // --- LOGIC A: Current Status ---
  let statusBg: string;
  let statusTitle: string;
  let statusDescription: string;
  
  if (data.netEnergy < 0) {
    statusBg = 'bg-green-800'; // Net Energy < 0: Đốt mỡ thừa (On Track)
    statusTitle = 'You are on track! 🔥';
    statusDescription = 'Your body is burning excess fat efficiently.';
  } else { // Net Energy >= 0 (Dư thừa)
    statusBg = 'bg-yellow-600'; // Net Energy >= 0: Dư năng lượng (Warning)
    statusTitle = 'Energy Surplus ⚠️';
    statusDescription = 'You have excess energy. Get some more exercise.';
  }

  // Component Status Card với logic đã áp dụng
  const CurrentStatusCard = () => (
    <div className={`rounded-2xl ${statusBg} p-5 text-white shadow-md`}>
      <p className="text-sm opacity-80">Current Status</p>
      <h2 className="mt-1 font-bold text-xl">{statusTitle}</h2>
      <p className="mt-1 text-sm">{statusDescription}</p>
    </div>
  );
  
  // --- LOGIC B: AI Suggestions (Conditional Rendering) ---
  const suggestions: React.ReactNode[] = []; // Đã sửa lỗi TypeScript
  const lastLogLower = data.lastLog.toLowerCase();

  // 1. Sugar Alert (Cảnh báo Đường)
  // Điều kiện: Nếu món ăn cuối cùng có chứa từ khóa "Tea", "Cake", "Sweet", "Coke".
  const isSugarAlert = ['tea', 'cake', 'sweet', 'coke'].some(keyword => lastLogLower.includes(keyword));
  if (isSugarAlert) {
    suggestions.push(
      <SuggestionCard
        key="sugar"
        accent="border-yellow-400"
        description="High blood sugar detected. Avoid sweets in the afternoon."
        icon={<TriangleAlert className="text-yellow-500" />}
        title="Sugar Alert"
        onClick={() => openModal("Sugar Alert Details", `Your last dish (${data.lastLog}) contains sugar. Maintain balance.!`)}
      />
    );
  }

  // 2. Hydration Check (Nhắc uống nước)
  // Điều kiện: Nếu Steps > 3000
  const isHydrationCheck = data.steps > 3000;
  if (isHydrationCheck) {
    suggestions.push(
      <SuggestionCard
        key="hydration"
        accent="border-blue-400"
        description="You have walked more than 3000 steps. Please drink 250ml of water immediately."
        icon={<Utensils className="text-blue-500" />}
        title="Hydration Check"
        onClick={() => openModal("",`Hydration Check Details with ${data.steps} having made it this far, replenishing fluids is essential to avoid dehydration and fatigue.`)}
      />
    );
  }

  // 3. Dinner Idea (Gợi ý bữa tối)
  if (data.kcalLeft > 500) {
    // Điều kiện 1: Kcal Left > 500
    suggestions.push(
      <SuggestionCard
        key="dinner_high"
        accent="border-purple-400"
        description="You still have plenty of calories. Suggestion: Pan-seared salmon + asparagus."
        icon={<Utensils className="text-purple-500" />}
        title="Dinner Idea"
        onClick={() => openModal("Dinner Idea (Many Calo)", `redundant ${data.kcalLeft} kcal! Salmon and asparagus are a nutritious choice to end your day.`)}
      />
    );
  } else if (data.kcalLeft < 200) {
    // Điều kiện 2: Kcal Left < 200
    suggestions.push(
      <SuggestionCard
        key="dinner_low"
        accent="border-red-400" 
        description="You're running out of your quota. Suggestion: A light salad or soup."
        icon={<Utensils className="text-red-500" />}
        title="Dinner Idea (Cảnh báo Quota)"
        onClick={() => openModal("Dinner Idea (a few Calo)", `Only ${data.kcalLeft} kcal! Choose light meals like salads to ensure you don't exceed your calorie target.`)}
      />
    );
  }
  
  // Nếu không có suggestions nào
  const NoSuggestions = () => (
      <div className="flex items-center justify-center p-8 bg-white rounded-xl text-gray-600 shadow-sm">
          <CheckCircle className="mr-2 text-green-500" />
          <p>No emergency tips. Everything is stable.!</p>
      </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 px-5 pb-24">
      <header className="pt-10">
        <h1 className="font-bold text-3xl">Smart Coach</h1>
      </header>

      <section className="mt-6">
        <CurrentStatusCard />
      </section>

      <h2 className="mt-8 font-semibold text-lg">AI Suggestions</h2>

      <div className="mt-3 space-y-4">
        {suggestions.length > 0 ? suggestions : <NoSuggestions />}
      </div>
      
      {/* Modal được hiển thị khi click vào card */}
      <SimpleModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={modalContent.title}
      >
        <p className="text-gray-700">{modalContent.detail}</p>
      </SimpleModal>
    </main>
  );
}