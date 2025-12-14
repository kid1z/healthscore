import { TriangleAlert, Utensils } from "lucide-react";
import type { ReactNode } from "react";
import { SuggestionCard } from "../components/suggestion-card";
import {
  HIGH_KCAL_THRESHOLD,
  HYDRATION_STEP_THRESHOLD,
  LOW_KCAL_THRESHOLD,
  SUGAR_KEYWORDS,
} from "../constants";
import type { CoachData } from "../types";

type OpenModalFn = (title: string, detail: string) => void;

export function generateSuggestions(
  data: CoachData,
  openModal: OpenModalFn
): ReactNode[] {
  const suggestions: ReactNode[] = [];
  const lastLogLower = data.lastLog.toLowerCase();

  // Sugar Alert
  const hasSugarContent = SUGAR_KEYWORDS.some((keyword) =>
    lastLogLower.includes(keyword)
  );
  if (hasSugarContent) {
    suggestions.push(
      <SuggestionCard
        accent="border-yellow-400"
        description="High blood sugar detected. Avoid sweets in the afternoon."
        icon={<TriangleAlert className="text-yellow-500" />}
        key="sugar"
        onClick={() =>
          openModal(
            "Sugar Alert Details",
            `Your last dish (${data.lastLog}) contains sugar. Maintain balance!`
          )
        }
        title="Sugar Alert"
      />
    );
  }

  // Hydration Check
  if (data.steps > HYDRATION_STEP_THRESHOLD) {
    suggestions.push(
      <SuggestionCard
        accent="border-blue-400"
        description="You have walked more than 3000 steps. Please drink 250ml of water immediately."
        icon={<Utensils className="text-blue-500" />}
        key="hydration"
        onClick={() =>
          openModal(
            "Hydration Check Details",
            `With ${data.steps} steps, replenishing fluids is essential to avoid dehydration and fatigue.`
          )
        }
        title="Hydration Check"
      />
    );
  }

  // Dinner Idea
  if (data.kcalLeft > HIGH_KCAL_THRESHOLD) {
    suggestions.push(
      <SuggestionCard
        accent="border-purple-400"
        description="You still have plenty of calories. Suggestion: Pan-seared salmon + asparagus."
        icon={<Utensils className="text-purple-500" />}
        key="dinner_high"
        onClick={() =>
          openModal(
            "Dinner Idea (High Calories)",
            `You have ${data.kcalLeft} kcal remaining! Salmon and asparagus are a nutritious choice to end your day.`
          )
        }
        title="Dinner Idea"
      />
    );
  } else if (data.kcalLeft < LOW_KCAL_THRESHOLD) {
    suggestions.push(
      <SuggestionCard
        accent="border-red-400"
        description="You're running out of your quota. Suggestion: A light salad or soup."
        icon={<Utensils className="text-red-500" />}
        key="dinner_low"
        onClick={() =>
          openModal(
            "Dinner Idea (Low Calories)",
            `Only ${data.kcalLeft} kcal left! Choose light meals like salads to ensure you don't exceed your calorie target.`
          )
        }
        title="Dinner Idea (Quota Warning)"
      />
    );
  }

  return suggestions;
}
