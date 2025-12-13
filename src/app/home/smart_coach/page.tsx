import { Droplet, TriangleAlert, Utensils } from "lucide-react";
import type { ReactNode } from "react";

function StatusCard() {
  return (
    <div className="rounded-2xl bg-green-500 p-5 text-white shadow-md">
      <p className="text-sm opacity-80">Current Status</p>
      <h2 className="mt-1 font-bold text-xl">You are on track! 🔥</h2>
      <p className="mt-1 text-sm">
        You have enough budget for a proper dinner.
      </p>
    </div>
  );
}

function SuggestionCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  accent?: string;
}) {
  return (
    <div
      className={`flex items-start rounded-2xl border-l-4 bg-white p-4 shadow-sm ${accent}`}
    >
      <div className="mr-3 text-xl">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function CoachPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-5 pb-24">
      <header className="pt-10">
        <h1 className="font-bold text-3xl">Smart Coach</h1>
      </header>

      <section className="mt-6">
        <StatusCard />
      </section>

      <h2 className="mt-8 font-semibold text-lg">AI Suggestions</h2>

      <div className="mt-3 space-y-4">
        <SuggestionCard
          accent="border-yellow-400"
          description="Your breakfast had high sugar. Avoid sweets this afternoon."
          icon={<TriangleAlert className="text-yellow-500" />}
          title="Sugar Alert"
        />

        <SuggestionCard
          accent="border-blue-400"
          description="You walked 5k steps. Drink 250ml water now."
          icon={<Droplet className="text-blue-500" />}
          title="Hydration Check"
        />

        <SuggestionCard
          accent="border-purple-400"
          description="Try Salmon + Asparagus to meet your protein goal."
          icon={<Utensils className="text-purple-500" />}
          title="Dinner Idea"
        />
      </div>
    </main>
  );
}
