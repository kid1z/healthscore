import type { ReactNode } from "react";

export type CoachData = {
  netEnergy: number;
  lastLog: string;
  steps: number;
  kcalLeft: number;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  bgColor: string;
};

export type SuggestionCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  accent: string;
  onClick: () => void;
};

export type StatusInfo = {
  bg: string;
  title: string;
  description: string;
};
