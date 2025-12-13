/** biome-ignore-all lint/nursery/noLeakedRender: <na> */
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
import { useEffect, useState } from "react";
import ShinyText from "@/components/shiny-text";

type appleHealthProps = {
  open: boolean;
  onClose: () => void;
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  burned: number;
  setBurned: React.Dispatch<React.SetStateAction<number>>;
  lastSyncSteps: number;
  setLastSyncSteps: React.Dispatch<React.SetStateAction<number>>;
  setCaloLeft: React.Dispatch<React.SetStateAction<number>>;
  inTake: number;
  goal: number;
  netEnergy: number;
  setNetEnergy: React.Dispatch<React.SetStateAction<number>>;
  bmr: number;
  sitting: number;
  setSitting: () => void;
  bodyEnergy: number;
  setBodyEnergy: () => void;
};

function AppleHealthSyncModal({
  open,
  onClose,
  steps,
  setSteps,
  burned,
  setBurned,
  lastSyncSteps,
  setLastSyncSteps,
  setCaloLeft,
  inTake,
  goal,
  setNetEnergy,
  bmr,
  sitting,
  setSitting,
  bodyEnergy,
  setBodyEnergy,
}: appleHealthProps) {
  const [showCongrats, setShowCongrats] = useState(false);

  const handleSync = () => {
    const stepVal = steps + 2109;
    const sittingVal = sitting + 2; //hours
    setSteps(stepVal);
    setSitting(sittingVal);

    //each step cost 0.05, each sitting hour cost 60
    const burnedVal = Math.round(burned + sittingVal * 60 + sittingVal * 0.05);
    setBurned(burnedVal);

    //Calo left = Goal(2000) + Burned(step) - Intake(food calo)
    setCaloLeft(() => Math.round(goal + burnedVal - inTake));
    setLastSyncSteps(stepVal);
    if (stepVal) {
      const bodyEnVal = Math.min(bodyEnergy + 10, 100);
      setBodyEnergy(bodyEnVal);
    }

    //Net Energy = Intake(food calo) - (BRM bio profile + Burned (step))
    console.log({
      inTake,
      bmr,
      burned: burnedVal,
    });
    setNetEnergy(() => inTake - (bmr + burnedVal));

    setShowCongrats(false); // reset animation
    setTimeout(() => setShowCongrats(true), 50);
    setTimeout(() => handleCancel(), 2000);
  };

  const handleCancel = () => {
    setShowCongrats(false); // reset animation
    onClose(); // close đóng modal
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-2xl">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <span className="text-xl">⌚</span>
        </div>

        {/* Title */}
        <h2 className="text-center font-semibold text-lg">Apple Health Sync</h2>
        <p className="mb-6 text-center text-gray-500 text-sm">
          Simulate incoming data
        </p>

        {/* Step */}
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
              🎉 Great job! You walked{" "}
              <span className="font-bold">{lastSyncSteps}</span> more steps
              today!
              <br />
              ⚠️ You’ve been sitting for{" "}
              <span className="font-bold">{sitting}</span> hours today
            </motion.p>
          )}
        </AnimatePresence>

        {/* Actions */}
        <button
          className="mt-6 w-full rounded-xl bg-gray-900 py-3 font-medium text-white"
          onClick={handleSync}
        >
          Sync Data
        </button>

        <button
          className="mt-3 w-full text-gray-500 text-sm"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

type UserTodayResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    bmr: number;
    weight: number;
    height: number;
    age: number;
  };
  meals: Array<{
    id: string;
    title: string;
    calories: number;
    createdAt: string;
    imageUrl?: string;
  }>;
  totalIntake: number;
};

async function getUserAndTodayMeals(
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

type bodyEnergyProp = {
  bodyEnergy: number;
};

function BodyEnergyGauge({ bodyEnergy }: bodyEnergyProp) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min(bodyEnergy / 100, 1); // max 100%
  const offset = circumference * (1 - progress);

  const strokeColor = bodyEnergy < 30 ? "rgba(183, 233, 4, 1)" : "#05D60E"; // green / red
  console.log("bodyEnergy ", bodyEnergy);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-48 w-48">
        <svg viewBox="0 0 100 100">
          <title>Calories Left Gauge</title>

          {/* Background */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />

          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-320 50 50)"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text:bold text-gray-500 text-sm">
            B.Energy: {bodyEnergy}%
          </div>
        </div>
      </div>
    </div>
  );
}

type circularGauProp = {
  goal: number;
  caloLeft: number;
};
function CircularGauge({ goal, caloLeft }: circularGauProp) {
  // const [isEditing, setIsEditing] = useState(false);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min(caloLeft / goal, 1); // max 100%
  const offset = circumference * (1 - progress);

  const strokeColor = caloLeft > 300 ? "#22c55e" : "#ef4444"; // green / red

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-48 w-48">
        <svg viewBox="0 0 100 100">
          <title>Calories Left Gauge</title>

          {/* Background */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />

          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-320 50 50)"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-bold text-4xl">{caloLeft}</div>
          <div className="text-gray-500 text-sm">Kcal Left</div>
          <div className="text-gray-500 text-sm">Goal: {goal}</div>
        </div>
      </div>
    </div>
  );
}

interface statCardProps {
  label: string;
  value: string | number;
  color?: string;
  onClick?: () => void;
}

export function StatCard({ label, value, color, onClick }: statCardProps) {
  return (
    <button
      className={`rounded-xl bg-white p-4 text-center shadow-sm transition ${onClick ? "cursor-pointer hover:shadow-md active:scale-[0.98]" : ""}
      `}
      disabled={!onClick}
      onClick={onClick}
    >
      <div className={`font-bold text-lg ${color}`}>{value}</div>
      <div className="mt-1 text-gray-500 text-xs">{label}</div>
    </button>
  );
}

type NutritionPanelProps = {
  netEnergy: number;
};

function NutritionPanel({ netEnergy }: NutritionPanelProps) {
  const isBurningFat = netEnergy <= 0;
  const netEnergyProgress = Math.min((netEnergy / 300) * 100, 100);

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
    <button className="mt-3 w-full rounded-2xl border bg-gray-100 p-4 text-center font-semibold text-gray-700 hover:bg-gray-200">
      <Link href="/home/smart_coach">Open Smart Coach</Link>
    </button>
  );
}

export default function Page() {
  const [openAppleHealth, setOpenAppleHealth] = useState(false);
  const [steps, setSteps] = useState(0);
  const [burned, setBurned] = useState(steps * 0.05);
  const [lastSyncSteps, setLastSyncSteps] = useState(0);
  const [user, setUser] = useState<UserTodayResponse["user"] | null>(null);
  const [loading, setLoading] = useState(true);

  const [goal, setGoal] = useState(2000);
  const [inTake, setInTake] = useState(1000);
  const [caloLeft, setCaloLeft] = useState(goal + burned - inTake);
  const [bmr] = useState(300);
  const [netEnergy, setNetEnergy] = useState(inTake - (bmr + burned));
  const [bodyEnergy, setBodyEnergy] = useState(80);
  const [sitting, setSitting] = useState(0);
  const [bodyEnergyImgUrl, setBodyEnergyImgUrl] = useState("");

  useEffect(() => {
    const userId = "b2e41dd8-74aa-4aec-a503-111d2f49461f";

    async function fetchData() {
      setLoading(true);
      const data = await getUserAndTodayMeals(userId);
      console.log("Fetched user today data:", data);
      const meals = data ? data.meals : [];
      let foodEngergyPercentage = 0;
      if (meals && meals.length > 0) {
        meals.map((item) => {
          if (item.calories >= 500) {
            foodEngergyPercentage -= 10;
          } else if (item.calories >= 300 && item.calories < 500) {
            foodEngergyPercentage -= 5;
          } else {
            foodEngergyPercentage += 2;
          }
        });
      }
      if (data) {
        setUser(data.user);
        // setTodayMeals(data.meals);
        // setBmr(data.user.bmr);
        setInTake(data.totalIntake);
        setCaloLeft(goal + burned - data.totalIntake);
        setNetEnergy(data.totalIntake - (bmr + burned));
      }
      setLoading(false);
    }

    fetchData();
  }, [goal, burned, bmr]);

  useEffect(() => {
    let bodyEnergyImgUrlVal = "";
    if (bodyEnergy >= 30 && bodyEnergy <= 70) {
      bodyEnergyImgUrlVal = "70v1.gif";
    } else if (bodyEnergy > 70) {
      bodyEnergyImgUrlVal = "90v1.gif";
    } else {
      bodyEnergyImgUrlVal = "30v1.gif";
    }

    setBodyEnergyImgUrl(bodyEnergyImgUrlVal);
  }, [bodyEnergy]);

  console.log("ody: ", bodyEnergy);

  return (
    <main className="container mx-auto min-h-screen bg-gray-50 p-6">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-4 rounded-2xl p-8">
              <ShinyText
                text="Thinking!"
                disabled={false}
                speed={3}
                className="animate-shine text-3xl"
              />
              {/* <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-violet-600" />
              <p className="font-medium text-gray-600">Loading dashboard...</p> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <header className="mb-6 flex justify-between">
        <h1 className="font-bold text-2xl">Dashboard</h1>
        {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
          <div className="h-6 w-6 rounded-full bg-purple-500" />
        </div> */}
      </header>

      <div className="flex justify-center">
        <img alt="no_image" src={`/uploads/${bodyEnergyImgUrl}`} />
      </div>
      <div className="flex flex-row justify-evenly">
        <CircularGauge caloLeft={caloLeft} goal={goal} />
        <BodyEnergyGauge bodyEnergy={bodyEnergy} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard color="text-blue-500" label="Intake" value={inTake} />

        <StatCard color="text-blue-500" label="Burned" value={burned} />

        <StatCard
          color="text-blue-500"
          label="Activity (Sync)"
          onClick={() => setOpenAppleHealth(true)}
          value={steps}
        />

        {/* Popup */}
        <AppleHealthSyncModal
          onClose={() => setOpenAppleHealth(false)}
          open={openAppleHealth}
          setSteps={setSteps}
          steps={steps}
          burned={burned}
          setBurned={setBurned}
          lastSyncSteps={lastSyncSteps}
          setLastSyncSteps={setLastSyncSteps}
          setCaloLeft={setCaloLeft}
          inTake={inTake}
          goal={goal}
          netEnergy={netEnergy}
          setNetEnergy={setNetEnergy}
          bmr={user ? user.bmr : 0}
          sitting={sitting}
          setSitting={setSitting}
          bodyEnergy={bodyEnergy}
          setBodyEnergy={setBodyEnergy}
        />
      </div>

      <NutritionPanel netEnergy={netEnergy} />
      <CoachButton />
      {/* <RecentLogs
        logs={[
          {
            title: "Healthy Salad",
            time: "12:30 PM",
            calories: -350,
            image: "/food_images/salad_001.png",
          },
          {
            title: "Protein Shake",
            time: "9:10 AM",
            calories: -220,
            image: "/food_images/protein_shake_001.png",
          },
        ]}
      /> */}
    </main>
  );
}
