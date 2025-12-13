/** biome-ignore-all lint/style/useConsistentTypeDefinitions: <NA> */
/** biome-ignore-all lint/correctness/useImageSize: <explanation> */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import Link from "next/link";

function BodyBattery() {
  return (
    <div className="mb-6">
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-semibold">Body Battery</span>
        <span className="font-semibold text-green-600">75%</span>
      </div>

      <div className="h-3 w-full rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-500"
          style={{ width: "75%" }}
        />
      </div>
    </div>
  );
}

function CircularGauge() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-48 w-48">
        <svg className="-rotate-90 transform" viewBox="0 0 100 100">
          <title>Calories Left Gauge</title>
          <circle
            cx="50"
            cy="50"
            fill="none"
            r="40"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            fill="none"
            r="40"
            stroke="#22c55e"
            strokeDasharray="251"
            strokeDashoffset="30"
            strokeLinecap="round"
            strokeWidth="10"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-bold text-4xl">1150</div>
          <div className="text-gray-500 text-sm">Kcal Left</div>
          <div className="mt-1 text-gray-400 text-xs">Goal: 2000</div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  label: string;
  value: string | number;
  color?: string;
}

export function StatCard({ label, value, color }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 text-center shadow-sm">
      <div className={`font-bold text-2xl ${color ?? "text-black"}`}>
        {value}
      </div>
      <div className="mt-1 text-gray-500 text-sm">{label}</div>
    </div>
  );
}

function NutritionPanel() {
  return (
    <div className="my-6 rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 font-semibold">Nutritional Breakdown</div>

      <div className="flex justify-between">
        <span className="font-semibold text-red-500">Net Energy</span>
        <span className="font-semibold text-gray-700">-824</span>
      </div>

      <div className="my-2 h-2 w-full rounded-full bg-gray-200">
        <div className="h-full w-1/2 rounded-full bg-red-500" />
      </div>

      <div className="text-sm">
        Status:{" "}
        <span className="font-semibold text-green-600">Burning Fat 🔥</span>
      </div>
    </div>
  );
}

function CoachButton() {
  return (
    <button className="mt-3 w-full rounded-2xl border bg-gray-100 p-4 text-center font-semibold text-gray-700 hover:bg-gray-200">
      <Link href="/smart_coach">Open Smart Coach</Link>
    </button>
  );
}

interface LogItem {
  title: string;
  time: string;
  calories: number; // số âm (đốt) hoặc dương (nạp)
  image?: string;
}

interface Props {
  logs: LogItem[];
}

function RecentLogs({ logs }: Props) {
  return (
    <div className="mt-6">
      <h2 className="mb-3 font-semibold text-lg">Recent Logs</h2>

      <div className="flex flex-col gap-3">
        {logs.map((log, idx) => (
          <div
            className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
            key={idx}
          >
            {/* Left section */}
            <div className="flex items-center gap-3">
              <img
                alt={log.title}
                className="h-12 w-12 rounded-full object-cover"
                src={log.image ?? "/public/vercel.svg"}
              />

              <div>
                <div className="font-semibold">{log.title}</div>
                <div className="text-gray-500 text-sm">{log.time}</div>
              </div>
            </div>

            {/* Right calories */}
            <div
              className={`font-bold text-lg ${
                log.calories < 0 ? "text-red-500" : "text-green-600"
              }`}
            >
              {log.calories}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-6">
      <header className="mb-6 flex justify-between">
        <h1 className="font-bold text-3xl">Dashboard</h1>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
          <div className="h-6 w-6 rounded-full bg-purple-500" />
        </div>
      </header>

      <BodyBattery />
      <CircularGauge />

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard color="text-red-500" label="INTAKE" logs={[]} value="1250" />
        <StatCard
          color="text-blue-500"
          label="BURNED (SYNC)"
          logs={[]}
          value="400"
        />
        <StatCard
          color="text-indigo-500"
          label="STEPS"
          logs={[]}
          value="5,230"
        />
      </div>

      <NutritionPanel />
      <CoachButton />
      <RecentLogs
        label={""}
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
        value={""}
      />
    </main>
  );
}
