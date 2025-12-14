/** biome-ignore-all lint/nursery/noLeakedRender: <ba> */
/** biome-ignore-all lint/a11y/noLabelWithoutControl: <na> */
/** biome-ignore-all lint/style/useConsistentTypeDefinitions: <na> */
"use client";

import {
  Activity,
  Calendar,
  ChevronRight,
  Ruler,
  Scale,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { redirect } from "next/navigation";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { upsertUserProfile } from "./actions";

// =================================================================
//                 LOGIC TÍNH TOÁN BMR (Không đổi)
// =================================================================
interface BMRParams {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: "Male" | "Female" | "";
}

const calculateBMR = ({
  weightKg,
  heightCm,
  age,
  gender,
}: BMRParams): number | null => {
  if (
    weightKg <= 0 ||
    heightCm <= 0 ||
    age <= 0 ||
    (gender !== "Male" && gender !== "Female")
  ) {
    return null;
  }
  let bmr: number;
  if (gender === "Male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  return Math.round(bmr);
};

// --- Components Phụ trợ (Dùng chung cho cả Form và Navbar) ---

// Component InputField with Icon
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  delay?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  delay = 0,
  className,
  ...props
}) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className={className}
    initial={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.4, delay }}
  >
    <label className="mb-2 block font-semibold text-gray-500 text-xs tracking-wider">
      {label}
    </label>
    <div className="group relative">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <span className="text-gray-400 transition-colors group-focus-within:text-violet-500">
            {icon}
          </span>
        </div>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white p-3 font-medium text-gray-800 text-md transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 hover:shadow-md focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 ${icon ? "pl-12" : ""}`}
      />
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-fuchsia-500/0 to-violet-500/0 opacity-0 transition-opacity duration-300 group-focus-within:opacity-10" />
    </div>
  </motion.div>
);

// Component SelectField with Icon
interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  icon?: React.ReactNode;
  delay?: number;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  icon,
  delay = 0,
  className,
  ...props
}) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className={className}
    initial={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.4, delay }}
  >
    <label className="mb-2 block font-semibold text-gray-500 text-xs tracking-wider">
      {label}
    </label>
    <div className="group relative">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <span className="text-gray-400 transition-colors group-focus-within:text-violet-500">
            {icon}
          </span>
        </div>
      )}
      <select
        {...props}
        className={`w-full appearance-none rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white p-3 font-medium text-gray-800 text-md transition-all duration-300 hover:border-gray-300 hover:shadow-md focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 ${icon ? "pl-12" : ""}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <title>chevron down</title>
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>
    </div>
  </motion.div>
);

// Component BMRCard with Animation
interface BMRCardProps {
  bmr: number | null;
}

const BMRCard: React.FC<BMRCardProps> = ({ bmr }) => (
  <motion.div
    animate={{ opacity: 1, scale: 1 }}
    className="mt-8 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 shadow-md"
    initial={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.5, delay: 0.6 }}
  >
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
          <Activity className="h-4 w-4 text-emerald-600" />
        </div>
        <span className="font-bold text-emerald-700 text-sm tracking-wide">
          ESTIMATED BMR
        </span>
      </div>
      <span
        className="cursor-help text-emerald-600"
        title="Basal Metabolic Rate: calories burned at rest"
      >
        ⓘ
      </span>
    </div>
    <div className="text-center">
      <motion.p
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text font-extrabold text-6xl text-transparent"
        initial={{ scale: 0.8, opacity: 0 }}
        key={bmr}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {bmr !== null ? bmr.toLocaleString() : "---"}
      </motion.p>
      <p className="mt-1 font-medium text-emerald-600 text-lg">kcal / day</p>
    </div>
  </motion.div>
);

// =================================================================
//                 COMPONENT CHÍNH (Gồm Header, Form, Footer)
// =================================================================

export default function ProfileSetupPage() {
  const [fullName, setFullName] = useState("Alex Chen");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [age, setAge] = useState<number>(25);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [isLoading, setIsLoading] = useState(false);

  const estimatedBMR = useMemo(
    () => calculateBMR({ weightKg, heightCm, age, gender }),
    [weightKg, heightCm, age, gender]
  );

  const handleCompleteSetup = async () => {
    if (estimatedBMR === null) {
      toast.error("Please fill in all fields completely and accurately.");
      return;
    }

    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await upsertUserProfile({
        name: fullName.trim(),
        gender,
        age,
        height: heightCm,
        weight: weightKg,
        bmr: estimatedBMR.toString(),
      });

      if (result.success) {
        toast.success(
          result.isNew
            ? `Profile created! Estimated BMR: ${estimatedBMR} kcal/day.`
            : `Profile updated! Estimated BMR: ${estimatedBMR} kcal/day.`
        );
      } else {
        toast.error(result.error || "Failed to save profile.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    } finally {
      setIsLoading(false);
      redirect("/home");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-violet-50/30 to-fuchsia-50/30">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="-top-40 -right-40 absolute h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="-bottom-40 -left-40 absolute h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />
      </div>

      {/* Nội dung Form Profile Setup */}
      <main className="relative z-10 flex w-full justify-center p-4 pb-24 sm:p-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-white/50 bg-white/80 p-6 shadow-md backdrop-blur-lg sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="mb-3 bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text font-bold text-3xl text-transparent">
            Profile Setup
          </h1>
          <div className="space-y-5">
            {/* FULL NAME */}
            <InputField
              delay={0.1}
              icon={<User className="h-5 w-5" />}
              label="FULL NAME"
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              type="text"
              value={fullName}
            />

            <div className="flex gap-4">
              {/* GENDER */}
              <SelectField
                className="w-1/2"
                delay={0.2}
                icon={<Users className="h-5 w-5" />}
                label="GENDER"
                onChange={(e) => setGender(e.target.value as "Male" | "Female")}
                options={["Male", "Female"]}
                value={gender}
              />

              {/* AGE */}
              <InputField
                className="w-1/2"
                delay={0.25}
                icon={<Calendar className="h-5 w-5" />}
                label="AGE"
                min={1}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="25"
                type="number"
                value={age === 0 ? "" : age}
              />
            </div>

            <div className="flex gap-4">
              {/* HEIGHT (CM) */}
              <InputField
                className="w-1/2"
                delay={0.3}
                icon={<Ruler className="h-5 w-5" />}
                label="HEIGHT (CM)"
                min={1}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                placeholder="175"
                type="number"
                value={heightCm === 0 ? "" : heightCm}
              />

              {/* WEIGHT (KG) */}
              <InputField
                className="w-1/2"
                delay={0.35}
                icon={<Scale className="h-5 w-5" />}
                label="WEIGHT (KG)"
                min={1}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                placeholder="70"
                type="number"
                value={weightKg === 0 ? "" : weightKg}
              />
            </div>
          </div>

          {/* BMR ESTIMATION CARD */}
          <BMRCard bmr={estimatedBMR} />

          {/* COMPLETE SETUP BUTTON */}
          <motion.button
            animate={{ opacity: 1, y: 0 }}
            className={`mt-8 w-full rounded-xl py-3 font-semibold shadow-md transition-all duration-300 ${
              estimatedBMR !== null && !isLoading
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-violet-500/25"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
            disabled={estimatedBMR === null || isLoading}
            initial={{ opacity: 0, y: 20 }}
            onClick={handleCompleteSetup}
            transition={{ duration: 0.4, delay: 0.7 }}
            whileHover={
              estimatedBMR !== null && !isLoading ? { scale: 1.02 } : {}
            }
            whileTap={
              estimatedBMR !== null && !isLoading ? { scale: 0.98 } : {}
            }
          >
            {isLoading ? "Saving..." : "Complete Setup"}
            {!isLoading && (
              <ChevronRight className="ml-2 inline-block h-5 w-5" />
            )}
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
