"use client";

import {
  Cookie,
  Droplets,
  Drumstick,
  Flame,
  Leaf,
  Wheat,
  Zap,
} from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/health-score";

type NutritionCardProps = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
};

type NutrientItemProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
  bgColor: string;
};

function NutrientItem({
  icon,
  label,
  value,
  unit,
  color,
  bgColor,
}: NutrientItemProps) {
  return (
    <div
      className={`${bgColor} rounded-xl p-4 transition-transform hover:scale-105`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            {label}
          </p>
          <p className="font-bold text-xl">
            {formatNumber(value, 0)}
            <span className="ml-1 font-normal text-muted-foreground text-sm">
              {unit}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function NutritionCard({
  calories,
  protein,
  carbs,
  fats,
  fiber,
  sugar,
  sodium,
}: NutritionCardProps) {
  const hasAdditionalNutrients =
    (fiber !== null && fiber !== undefined) ||
    (sugar !== null && sugar !== undefined) ||
    (sodium !== null && sodium !== undefined);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-amber-500" />
          Nutritional Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main macros */}
        <div className="grid grid-cols-2 gap-3">
          <NutrientItem
            bgColor="bg-orange-50 dark:bg-orange-950/30"
            color="bg-gradient-to-br from-orange-400 to-red-500"
            icon={<Flame className="h-5 w-5 text-white" />}
            label="Calories"
            unit="kcal"
            value={calories}
          />
          <NutrientItem
            bgColor="bg-rose-50 dark:bg-rose-950/30"
            color="bg-gradient-to-br from-rose-400 to-pink-600"
            icon={<Drumstick className="h-5 w-5 text-white" />}
            label="Protein"
            unit="g"
            value={protein}
          />
          <NutrientItem
            bgColor="bg-amber-50 dark:bg-amber-950/30"
            color="bg-gradient-to-br from-amber-400 to-yellow-600"
            icon={<Wheat className="h-5 w-5 text-white" />}
            label="Carbs"
            unit="g"
            value={carbs}
          />
          <NutrientItem
            bgColor="bg-sky-50 dark:bg-sky-950/30"
            color="bg-gradient-to-br from-sky-400 to-blue-600"
            icon={<Droplets className="h-5 w-5 text-white" />}
            label="Fats"
            unit="g"
            value={fats}
          />
        </div>

        {/* Additional nutrients */}
        {hasAdditionalNutrients ? (
          <div className="border-t pt-4">
            <p className="mb-3 text-muted-foreground text-sm">
              Additional Nutrients
            </p>
            <div className="flex flex-wrap gap-2">
              {fiber !== null && fiber !== undefined ? (
                <Badge className="gap-1.5 py-1.5" variant="secondary">
                  <Leaf className="h-3.5 w-3.5 text-green-500" />
                  Fiber: {formatNumber(fiber, 0)}g
                </Badge>
              ) : null}
              {sugar !== null && sugar !== undefined ? (
                <Badge className="gap-1.5 py-1.5" variant="secondary">
                  <Cookie className="h-3.5 w-3.5 text-pink-500" />
                  Sugar: {formatNumber(sugar, 0)}g
                </Badge>
              ) : null}
              {sodium !== null && sodium !== undefined ? (
                <Badge className="gap-1.5 py-1.5" variant="secondary">
                  <Zap className="h-3.5 w-3.5 text-yellow-500" />
                  Sodium: {formatNumber(sodium, 0)}mg
                </Badge>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Macro ratio bar */}
        <div className="pt-2">
          <p className="mb-2 text-muted-foreground text-sm">Macro Ratio</p>
          <div className="flex h-3 overflow-hidden rounded-full bg-muted">
            {(() => {
              const total = protein * 4 + carbs * 4 + fats * 9;
              const proteinPercent =
                total > 0 ? ((protein * 4) / total) * 100 : 33;
              const carbsPercent = total > 0 ? ((carbs * 4) / total) * 100 : 33;
              const fatsPercent = total > 0 ? ((fats * 9) / total) * 100 : 34;
              return (
                <>
                  <div
                    className="bg-gradient-to-r from-rose-400 to-pink-500 transition-all"
                    style={{ width: `${proteinPercent}%` }}
                  />
                  <div
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 transition-all"
                    style={{ width: `${carbsPercent}%` }}
                  />
                  <div
                    className="bg-gradient-to-r from-sky-400 to-blue-500 transition-all"
                    style={{ width: `${fatsPercent}%` }}
                  />
                </>
              );
            })()}
          </div>
          <div className="mt-1.5 flex justify-between text-muted-foreground text-xs">
            <span>Protein</span>
            <span>Carbs</span>
            <span>Fats</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
