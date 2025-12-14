import type { CoachData } from "./types";

export const MOCK_DATA: CoachData = {
  netEnergy: -100,
  lastLog: "Latte and a small Cake",
  steps: 4500,
  kcalLeft: 650,
};

export const GOAL_KCAL = 2000;

export const SUGAR_KEYWORDS = ["tea", "cake", "sweet", "coke"];
export const HYDRATION_STEP_THRESHOLD = 3000;
export const HIGH_KCAL_THRESHOLD = 500;
export const LOW_KCAL_THRESHOLD = 200;
