import type { StatusInfo } from "../types";

export function getStatusInfo(netEnergy: number): StatusInfo {
  if (netEnergy < 0) {
    return {
      bg: "bg-green-800",
      title: "You are on track! 🔥",
      description: "Your body is burning excess fat efficiently.",
    };
  }

  return {
    bg: "bg-yellow-600",
    title: "Energy Surplus ⚠️",
    description: "You have excess energy. Get some more exercise.",
  };
}
