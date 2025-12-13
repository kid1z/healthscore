'use client'; 

import React, { useState, useMemo } from 'react';
import Link from 'next/link'; // Cần thiết cho Navbar

// =================================================================
//                 LOGIC TÍNH TOÁN BMR (Không đổi)
// =================================================================
interface BMRParams {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'Male' | 'Female' | '';
}

const calculateBMR = ({ weightKg, heightCm, age, gender }: BMRParams): number | null => {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0 || (gender !== 'Male' && gender !== 'Female')) {
    return null;
  }
  let bmr: number;
  if (gender === 'Male') {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
  } else {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
  }
  return Math.round(bmr);
};

// --- Components Phụ trợ (Dùng chung cho cả Form và Navbar) ---

interface NavItemProps {
    icon: string;
    label: string;
    isActive: boolean;
    href: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, href }) => (
    <Link href={href} className="flex flex-col items-center transition-colors">
        <span className={`text-xl ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>{icon}</span>
        <p className={`text-xs font-medium ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>{label}</p>
    </Link>
);

const BottomNavbar: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t border-gray-200 p-4 max-w-lg mx-auto w-full z-10">
            <div className="flex justify-around items-center">
                <NavItem icon="🏠" label="Home" isActive={false} href="/landing" />
                
                <div className="relative -top-6">
                    <button className="bg-gray-900 text-white rounded-full p-4 shadow-2xl hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.808-1.212A2 2 0 0110.424 4h3.152a2 2 0 011.664.89l.808 1.212a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
                
                <NavItem icon="🌿" label="Coach" isActive={true} href="/coach" />
            </div>
        </nav>
    );
};


// Component InputField
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, className, ...props }) => (
  <div className={className}>
    <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
    <input
      {...props}
      className={`w-full p-3 border border-gray-300 rounded-lg text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900`}
    />
  </div>
);

// Component SelectField
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, options, className, ...props }) => (
  <div className={className}>
    <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
    <select
      {...props}
      className="w-full p-3 border border-gray-300 rounded-lg text-lg font-medium text-gray-800 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Component BMRCard
interface BMRCardProps {
  bmr: number | null;
}

const BMRCard: React.FC<BMRCardProps> = ({ bmr }) => (
  <div className="mt-8 p-6 rounded-xl bg-green-50/70 border border-green-200">
    <div className="flex justify-between items-center text-green-700 font-semibold mb-2">
      <span className="text-sm">ESTIMATED BMR</span>
      <span title="Basal Metabolic Rate: calories burned at rest">ⓘ</span>
    </div>
    <div className="text-center">
      <p className="text-6xl font-extrabold text-green-600">
        {bmr !== null ? bmr.toLocaleString() : '---'}
      </p>
      <p className="text-lg text-green-700 font-medium">
        kcal / day
      </p>
    </div>
  </div>
);


// =================================================================
//                 COMPONENT CHÍNH (Gồm Header, Form, Footer)
// =================================================================

export default function ProfileSetupPage() {
  const [fullName, setFullName] = useState('Alex Chen');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male'); 
  const [age, setAge] = useState<number>(25);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);

  const estimatedBMR = useMemo(() => {
    return calculateBMR({ weightKg, heightCm, age, gender });
  }, [weightKg, heightCm, age, gender]);

  const handleCompleteSetup = () => {
    if (estimatedBMR === null) {
      alert('Vui lòng điền đầy đủ và chính xác thông tin để tính BMR.');
      return;
    }
    console.log('Dữ liệu đã thiết lập:', { fullName, gender, age, heightCm, weightKg, bmr: estimatedBMR });
    alert(`Thiết lập hồ sơ hoàn tất! BMR ước tính: ${estimatedBMR} kcal/ngày.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        {/* Header - Có thể thay bằng component HealthScore riêng */}
        <header className="w-full max-w-lg bg-white shadow-sm p-4 border-b border-gray-200 z-10">
            <h1 className="text-2xl font-bold text-gray-900">Profile Setup</h1>
        </header>

        {/* Nội dung Form Profile Setup */}
        <main className="flex justify-center w-full p-4 sm:p-6 pb-24"> 
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
                
                <div className="space-y-6">
                    {/* FULL NAME */}
                    <InputField
                      label="FULL NAME"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Chen"
                      type="text"
                    />

                    <div className="flex space-x-4">
                      {/* GENDER */}
                      <SelectField
                        label="GENDER"
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                        options={['Male', 'Female']}
                        className="w-1/2"
                      />
                      
                      {/* AGE */}
                      <InputField
                        label="AGE"
                        value={age === 0 ? '' : age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        placeholder="25"
                        type="number"
                        min={1}
                        className="w-1/2"
                      />
                    </div>

                    <div className="flex space-x-4">
                      {/* HEIGHT (CM) */}
                      <InputField
                        label="HEIGHT (CM)"
                        value={heightCm === 0 ? '' : heightCm}
                        onChange={(e) => setHeightCm(Number(e.target.value))}
                        placeholder="175"
                        type="number"
                        min={1}
                        className="w-1/2"
                      />
                      
                      {/* WEIGHT (KG) */}
                      <InputField
                        label="WEIGHT (KG)"
                        value={weightKg === 0 ? '' : weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        placeholder="70"
                        type="number"
                        min={1}
                        className="w-1/2"
                      />
                    </div>
                </div>

                {/* BMR ESTIMATION CARD */}
                <BMRCard bmr={estimatedBMR} />

                {/* COMPLETE SETUP BUTTON */}
                <button
                    onClick={handleCompleteSetup}
                    disabled={estimatedBMR === null}
                    className={`w-full py-4 mt-8 rounded-xl font-semibold transition-colors 
                      ${estimatedBMR !== null
                        ? 'bg-gray-900 text-white hover:bg-gray-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                >
                    Complete Setup
                </button>
            </div>
        </main>
        
        {/* Bottom Navbar (Footer) */}
        <BottomNavbar />
    </div>
  );
}