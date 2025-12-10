"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getHealthScoreColor,
  getHealthScoreDescription,
  getHealthScoreGradient,
  getHealthScoreLabel,
} from "@/lib/health-score";

type HealthScoreDisplayProps = {
  score: number;
  showDescription?: boolean;
  size?: "sm" | "md" | "lg";
};

function getStopColor(score: number): string {
  if (score >= 90) {
    return "#10b981";
  }
  if (score >= 70) {
    return "#22c55e";
  }
  if (score >= 50) {
    return "#eab308";
  }
  if (score >= 30) {
    return "#f97316";
  }
  return "#ef4444";
}

function getEndStopColor(score: number): string {
  if (score >= 90) {
    return "#2dd4bf";
  }
  if (score >= 70) {
    return "#10b981";
  }
  if (score >= 50) {
    return "#f59e0b";
  }
  if (score >= 30) {
    return "#f59e0b";
  }
  return "#f43f5e";
}

function getStopClassName(gradient: string): string {
  if (gradient.includes("emerald")) {
    return "stop-emerald-500";
  }
  if (gradient.includes("green")) {
    return "stop-green-500";
  }
  if (gradient.includes("yellow")) {
    return "stop-yellow-500";
  }
  if (gradient.includes("orange")) {
    return "stop-orange-500";
  }
  return "stop-red-500";
}

export function HealthScoreDisplay({
  score,
  showDescription = true,
  size = "lg",
}: HealthScoreDisplayProps) {
  const sizeClasses = {
    sm: { container: "w-20 h-20", text: "text-xl", label: "text-xs" },
    md: { container: "w-28 h-28", text: "text-3xl", label: "text-sm" },
    lg: { container: "w-40 h-40", text: "text-5xl", label: "text-base" },
  };

  const currentSize = sizeClasses[size];
  const gradient = getHealthScoreGradient(score);
  const label = getHealthScoreLabel(score);
  const description = getHealthScoreDescription(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col items-center p-6">
        <div className={`relative ${currentSize.container}`}>
          {/* Background circle */}
          <svg
            aria-labelledby="health-score-title"
            className="-rotate-90 h-full w-full transform"
            role="img"
            viewBox="0 0 100 100"
          >
            <title id="health-score-title">
              Health Score: {score} out of 100
            </title>
            <circle
              className="text-muted/30"
              cx="50"
              cy="50"
              fill="none"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="45"
              stroke="url(#scoreGradient)"
              strokeLinecap="round"
              strokeWidth="8"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: "stroke-dashoffset 1s ease-in-out",
              }}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient
                id="scoreGradient"
                x1="0%"
                x2="100%"
                y1="0%"
                y2="0%"
              >
                <stop
                  className={getStopClassName(gradient)}
                  offset="0%"
                  style={{ stopColor: getStopColor(score) }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: getEndStopColor(score) }}
                />
              </linearGradient>
            </defs>
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-bold ${currentSize.text} ${getHealthScoreColor(score)}`}
            >
              {score}
            </span>
            <span className="text-muted-foreground text-xs">/ 100</span>
          </div>
        </div>

        <Badge
          className={`mt-4 ${currentSize.label} bg-gradient-to-r ${gradient} border-0 text-white`}
          variant="secondary"
        >
          {label}
        </Badge>

        {showDescription ? (
          <p className="mt-3 max-w-xs text-center text-muted-foreground text-sm">
            {description}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
