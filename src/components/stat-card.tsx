"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  gradient?: string;
};

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") {
    return <TrendingUp className="h-4 w-4" />;
  }
  if (trend === "down") {
    return <TrendingDown className="h-4 w-4" />;
  }
  return <Minus className="h-4 w-4" />;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
  gradient = "from-violet-500 to-fuchsia-500",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-sm">{title}</p>
            <p className="font-bold text-3xl">{value}</p>
            {subtitle ? (
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            ) : null}
            {trend !== undefined && trendValue !== undefined ? (
              <div
                className={cn(
                  "flex items-center gap-1 font-medium text-sm",
                  trend === "up" ? "text-emerald-500" : "",
                  trend === "down" ? "text-red-500" : "",
                  trend === "neutral" ? "text-muted-foreground" : ""
                )}
              >
                <TrendIcon trend={trend} />
                {trendValue}
              </div>
            ) : null}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
              gradient
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
