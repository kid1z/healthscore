/** biome-ignore-all lint/style/useFilenamingConvention: <na> */
import { useEffect, useState } from "react";
import { USER_ID } from "@/app/constants";
import { getUserAndTodayMeals } from "../../dashboard/page";
import { GOAL_KCAL, MOCK_DATA } from "../constants";
import type { CoachData } from "../types";

type UserMealsData = {
  user?: { bmr?: number; meals?: string[] };
  exercise?: { step?: number; sitting?: number };
  totalIntake?: number;
};

function calculateBurnedCalories(exercise?: {
  step?: number;
  sitting?: number;
}): number {
  const burnedFromSitting = (exercise?.sitting ?? 0) * 60;
  const burnedFromSteps = (exercise?.step ?? 0) * 0.05;
  return Math.round(burnedFromSitting + burnedFromSteps);
}

function mapToCoachData(data: UserMealsData): CoachData {
  const { user = {}, exercise = {}, totalIntake = 0 } = data;

  const bmr = Number(user.bmr) || 300;
  const steps = Number(exercise?.step) || 0;
  const burned = calculateBurnedCalories(exercise);
  const netEnergy = totalIntake - (bmr + burned);

  return {
    netEnergy,
    lastLog: user.meals?.[user.meals.length - 1] || "Unknown",
    steps,
    kcalLeft: GOAL_KCAL + burned - totalIntake,
  };
}

export function useCoachData() {
  const [data, setData] = useState<CoachData>(MOCK_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getUserAndTodayMeals(USER_ID);
        if (response) {
          setData(mapToCoachData(response));
        }
      } catch (error) {
        console.error("Failed to fetch coach data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading };
}
