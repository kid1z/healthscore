/** biome-ignore-all lint/nursery/noLeakedRender: <na> */
/** biome-ignore-all lint/correctness/noUnusedVariables: <ba> */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <na> */
/** biome-ignore-all lint/suspicious/noDoubleEquals: <na> */
/** biome-ignore-all lint/style/useTemplate: <na> */
/** biome-ignore-all assist/source/useSortedAttributes: <na> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <na> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <na> */
/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: <na> */
/** biome-ignore-all lint/a11y/useButtonType: <na> */
/** biome-ignore-all lint/style/useConsistentTypeDefinitions: <NA> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <na> */
/** biome-ignore-all lint/correctness/useImageSize: <na> */
/** biome-ignore-all lint/performance/noImgElement: <na> */
/** biome-ignore-all lint/a11y/useButtonType: <na> */
"use client";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { USER_ID } from "@/app/constants";
import Thinking from "@/components/thinking";
import { Button } from "@/components/ui/button";

// ============ Constants ============
const DEFAULT_GOAL = 2000;
const DEFAULT_BODY_ENERGY = 80;
const STEPS_CALORIE_RATE = 0.05;
const SITTING_CALORIE_RATE = 60;
const SYNC_STEP_INCREMENT = 2109;
const SYNC_SITTING_INCREMENT = 2;
const BODY_ENERGY_STEP_CHANGE = 10;

// ============ Types ============
interface User {
  id: string;
  name: string;
  email: string;
  bmr: number;
  weight: number;
  height: number;
  age: number;
}

interface Meal {
  id: string;
  title: string;
  calories: number;
  createdAt: string;
  imageUrl?: string;
}

interface Exercise {
  id: string;
  date: string;
  step: number;
  sitting: number;
}

interface UserTodayResponse {
  user: User;
  meals: Meal[];
  totalIntake: number;
  exercise: Exercise | null;
}

interface DashboardState {
  steps: number;
  burned: number;
  sitting: number;
  inTake: number;
  caloLeft: number;
  netEnergy: number;
  bodyEnergy: number;
  bmr: number;
}

interface AppleHealthSyncModalProps {
  open: boolean;
  state: DashboardState;
  goal: number;
  selectedSyncType: string;
  onClose: () => void;
  onSync: (type: string) => Promise<void>;
  onTypeChange: (type: string) => void;
}

interface CircularGaugeProps {
  goal: number;
  caloLeft: number;
}

interface BodyEnergyGaugeProps {
  bodyEnergy: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  onClick?: () => void;
}

interface NutritionPanelProps {
  netEnergy: number;
}

// ============ Utility Functions ============
const calculateBurned = (steps: number, sitting: number): number =>
  Math.round(sitting * SITTING_CALORIE_RATE + steps * STEPS_CALORIE_RATE);

const calculateCaloLeft = (
  goal: number,
  burned: number,
  inTake: number
): number => Math.round(goal + burned - inTake);

const calculateNetEnergy = (
  inTake: number,
  bmr: number,
  burned: number
): number => inTake - (bmr + burned);

const calculateBodyEnergy = (
  meals: Meal[],
  steps: number,
  sitting: number
): number => {
  const foodEnergyPercentage = meals.reduce((acc, { calories }) => {
    if (calories >= 500) {
      return acc - 10;
    }
    if (calories >= 300) {
      return acc - 5;
    }
    return acc + 2;
  }, DEFAULT_BODY_ENERGY);

  return (
    foodEnergyPercentage +
    Math.round(steps / 2000) * 10 -
    Math.round((sitting / 2) * 10)
  );
};

const getBodyEnergyImageUrl = (bodyEnergy: number): string => {
  if (bodyEnergy > 70) {
    return "90v1.gif";
  }
  if (bodyEnergy >= 30) {
    return "70v1.gif";
  }
  return "30v1.gif";
};

// ============ API Functions ============
export async function getUserAndTodayMeals(
  userId: string
): Promise<UserTodayResponse | null> {
  try {
    const response = await fetch(`/api/users/${userId}/today`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user and meals:", error);
    return null;
  }
}

async function syncHealthData(
  userId: string,
  step: number,
  sitting: number
): Promise<boolean> {
  try {
    const response = await fetch("/api/sync", {
      method: "POST",
      body: JSON.stringify({ id: userId, step, sitting }),
      headers: { "Content-Type": "application/json" },
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to sync data:", error);
    return false;
  }
}

// ============ Components ============
function AppleHealthSyncModal({
  open,
  state,
  goal,
  selectedSyncType,
  onClose,
  onSync,
  onTypeChange,
}: AppleHealthSyncModalProps) {
  const [showCongrats, setShowCongrats] = useState(false);

  const handleSync = async () => {
    await onSync(selectedSyncType);
    setShowCongrats(false);
    setTimeout(() => setShowCongrats(true), 50);
    setTimeout(() => {
      setShowCongrats(false);
      onClose();
    }, 2000);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-2xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <span className="text-xl">⌚</span>
        </div>

        <h2 className="text-center font-semibold text-lg">Apple Health Sync</h2>
        <p className="mb-6 text-center text-gray-500 text-sm">
          Select your data to sync
        </p>

        <select
          name="selectedTypeSync"
          value={selectedSyncType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="step">Step</option>
          <option value="sitting">Sitting</option>
        </select>

        <AnimatePresence>
          {showCongrats && (
            <motion.p
              animate={{ opacity: 1, y: -10, scale: 1.05 }}
              className="mt-6 text-center font-semibold text-1xl text-indigo-600"
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              key="congrats"
              transition={{
                duration: 0.6,
                ease: "easeOut",
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
            >
              {selectedSyncType === "step" ? (
                <>
                  🎉 Great job! You walked{" "}
                  <span className="font-bold">{state.steps}</span> steps today!
                </>
              ) : (
                <>
                  ⚠️ You've been sitting for{" "}
                  <span className="font-bold">{state.sitting}</span> hours today
                </>
              )}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          className="mt-6 w-full rounded-xl bg-gray-900 py-3 font-medium text-white"
          onClick={handleSync}
        >
          Sync Data
        </button>

        <button className="mt-3 w-full text-gray-500 text-sm" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function CircularGauge({ goal, caloLeft }: CircularGaugeProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(caloLeft / goal, 1);
  const offset = circumference * (1 - progress);
  const strokeColor = caloLeft > 300 ? "#22c55e" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-42 w-42 md:h-48 md:w-48">
        <svg viewBox="0 0 100 100">
          <title>Calories Left Gauge</title>
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="7"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-320 50 50)"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-bold text-3xl md:text-4xl">{caloLeft}</div>
          <div className="text-gray-500 text-sm">Kcal left</div>
          <div className="text-gray-500 text-sm">Goal: {goal}</div>
        </div>
      </div>
    </div>
  );
}

function BodyEnergyGauge({ bodyEnergy }: BodyEnergyGaugeProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(bodyEnergy / 100, 1);
  const offset = circumference * (1 - progress);
  const strokeColor = bodyEnergy < 30 ? "rgba(183, 233, 4, 1)" : "#05D60E";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-42 w-42 md:h-48 md:w-48">
        <svg viewBox="0 0 100 100">
          <title>B.Energy</title>
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="7"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-320 50 50)"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text:bold text-gray-500 text-sm">
            B.Energy: {bodyEnergy}%
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatCard({ label, value, color, onClick }: StatCardProps) {
  return (
    <button
      className={`rounded-xl bg-white p-4 text-center shadow-sm transition ${
        onClick ? "cursor-pointer hover:shadow-md active:scale-[0.98]" : ""
      }`}
      disabled={!onClick}
      onClick={onClick}
    >
      <div className={`font-bold text-lg ${color}`}>{value}</div>
      <div className="mt-1 text-gray-500 text-xs">{label}</div>
    </button>
  );
}

function NutritionPanel({ netEnergy }: NutritionPanelProps) {
  const isBurningFat = netEnergy <= 0;
  const netEnergyProgress = Math.min((netEnergy / 300) * 100, 100);

  console.log("netEnergyProgress: ", netEnergyProgress);

  return (
    <div className="my-6 rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 font-semibold">Nutritional Breakdown</div>

      <div className="flex justify-between">
        <span className="font-semibold text-red-500">Net Energy</span>
        <span className="font-semibold text-gray-700">{netEnergy}</span>
      </div>

      <div className="my-2 h-2 w-full rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isBurningFat ? "bg-green-500" : "bg-orange-400"}
          `}
          style={{ width: `${netEnergyProgress}%` }}
        />
      </div>

      <div className="text-sm">
        Status:{" "}
        <span
          className={`font-semibold ${
            isBurningFat ? "text-green-600" : "text-orange-500"
          }
          `}
        >
          {isBurningFat ? "Burning Fat 🔥" : "Surplus / Storing Fat ⚠️"}
        </span>
      </div>
    </div>
  );
}

function CoachButton() {
  return (
    <Link href="/home/smart_coach">
      <Button className="mt-3 w-full rounded-2xl border bg-fuchsia-500/10 p-6 text-center font-semibold text-fuchsia-600 text-xl hover:bg-fuchsia-500/40">
        Open Smart Coach
      </Button>
    </Link>
  );
}

// ============ Custom Hook ============
function useDashboardData() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<DashboardState>({
    steps: 0,
    burned: 0,
    sitting: 0,
    inTake: 1000,
    caloLeft: DEFAULT_GOAL,
    netEnergy: 0,
    bodyEnergy: DEFAULT_BODY_ENERGY,
    bmr: 300,
  });

  const updateState = useCallback((updates: Partial<DashboardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserAndTodayMeals(USER_ID);
        if (!data) {
          return;
        }

        const { user: userData, meals = [], totalIntake, exercise } = data;
        const steps = exercise?.step ?? 0;
        const sitting = exercise?.sitting ?? 0;
        const bmr = Number(userData.bmr);
        const burned = calculateBurned(steps, sitting);
        const bodyEnergy = calculateBodyEnergy(meals, steps, sitting);

        setUser(userData);
        updateState({
          steps,
          sitting,
          bmr,
          burned,
          bodyEnergy,
          inTake: totalIntake,
          caloLeft: calculateCaloLeft(DEFAULT_GOAL, burned, totalIntake),
          netEnergy: calculateNetEnergy(totalIntake, bmr, burned),
        });
      } catch (error) {
        console.error("Failed to fetch user meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateState]);

  return { user, loading, state, updateState };
}

// ============ Main Component ============
export default function Page() {
  const { user, loading, state, updateState } = useDashboardData();
  const [openAppleHealth, setOpenAppleHealth] = useState(false);
  const [selectedSyncType, setSelectedSyncType] = useState("step");

  const bodyEnergyImgUrl = useMemo(
    () => getBodyEnergyImageUrl(state.bodyEnergy),
    [state.bodyEnergy]
  );

  const handleSync = useCallback(
    async (syncType: string) => {
      const isStepSync = syncType === "step";
      const newSteps = isStepSync
        ? state.steps + SYNC_STEP_INCREMENT
        : state.steps;
      const newSitting = isStepSync
        ? state.sitting
        : state.sitting + SYNC_SITTING_INCREMENT;
      const newBodyEnergy = isStepSync
        ? state.bodyEnergy + BODY_ENERGY_STEP_CHANGE
        : state.bodyEnergy - BODY_ENERGY_STEP_CHANGE;

      const newBurned = isStepSync
        ? Math.round(state.burned + newSteps * STEPS_CALORIE_RATE)
        : Math.round(state.burned + newSitting * SITTING_CALORIE_RATE);

      const success = await syncHealthData(USER_ID, newSteps, newSitting);
      if (!success) {
        return;
      }

      updateState({
        steps: newSteps,
        sitting: newSitting,
        burned: newBurned,
        bodyEnergy: newBodyEnergy,
        caloLeft: calculateCaloLeft(DEFAULT_GOAL, newBurned, state.inTake),
        netEnergy: calculateNetEnergy(state.inTake, state.bmr, newBurned),
      });
    },
    [state, updateState]
  );

  return (
    <main className="container mx-auto p-6">
      <Thinking loading={loading} />

      <header className="mb-6 flex justify-between">
        <h1 className="font-bold text-2xl">Dashboard</h1>
      </header>

      <div className="flex justify-center">
        <img
          alt="Body energy visualization"
          src={`/uploads/${bodyEnergyImgUrl}`}
        />
      </div>

      <div className="flex flex-row justify-evenly">
        <CircularGauge caloLeft={state.caloLeft} goal={DEFAULT_GOAL} />
        <BodyEnergyGauge bodyEnergy={state.bodyEnergy} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard color="text-blue-500" label="Intake" value={state.inTake} />
        <StatCard color="text-blue-500" label="Burned" value={state.burned} />
        <StatCard
          color="text-blue-500"
          label="Activity (Sync)"
          onClick={() => setOpenAppleHealth(true)}
          value={state.steps}
        />
      </div>

      <AppleHealthSyncModal
        open={openAppleHealth}
        state={state}
        goal={DEFAULT_GOAL}
        selectedSyncType={selectedSyncType}
        onClose={() => setOpenAppleHealth(false)}
        onSync={handleSync}
        onTypeChange={setSelectedSyncType}
      />

      <NutritionPanel netEnergy={state.netEnergy} />
      <CoachButton />
    </main>
  );
}
