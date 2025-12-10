"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock, Flame, Trash2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getHealthScoreGradient,
  getHealthScoreLabel,
} from "@/lib/health-score";

export type Meal = {
  id: string;
  imageUrl: string;
  dishName: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  healthScore: number;
  analysis?: string | null;
  createdAt: string;
};

type MealCardProps = {
  meal: Meal;
  onDelete?: (id: string) => void;
};

export function MealCard({ meal, onDelete }: MealCardProps) {
  const gradient = getHealthScoreGradient(meal.healthScore);
  const label = getHealthScoreLabel(meal.healthScore);

  return (
    <Card className="group hover:-translate-y-1 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          alt={meal.dishName}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          src={meal.imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Health score badge */}
        <Badge
          className={`absolute top-3 right-3 bg-gradient-to-r ${gradient} border-0 text-white shadow-lg`}
        >
          {meal.healthScore} • {label}
        </Badge>

        {/* Delete button */}
        {onDelete ? (
          <Button
            className="absolute top-3 left-3 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(meal.id);
            }}
            size="icon"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}

        {/* Dish name overlay */}
        <div className="absolute right-0 bottom-0 left-0 p-4">
          <h3 className="line-clamp-1 font-semibold text-lg text-white">
            {meal.dishName}
          </h3>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              {Math.round(meal.calories)} kcal
            </span>
          </div>
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(meal.createdAt), { addSuffix: true })}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge className="text-xs" variant="secondary">
            P: {Math.round(meal.protein)}g
          </Badge>
          <Badge className="text-xs" variant="secondary">
            C: {Math.round(meal.carbs)}g
          </Badge>
          <Badge className="text-xs" variant="secondary">
            F: {Math.round(meal.fats)}g
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
