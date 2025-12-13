"use client";

import {
  Droplets,
  Drumstick,
  Flame,
  LayoutDashboard,
  TrendingUp,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  HealthScoreChart,
  MacroAverageChart,
  ScoreDistributionChart,
} from "@/components/charts";
import { EmptyState } from "@/components/loading-states";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Stats = {
  totalMeals: number;
  averages: {
    healthScore: number;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  distribution: {
    excellent: number;
    good: number;
    moderate: number;
    poor: number;
  };
  recentMeals: Array<{
    date: string;
    healthScore: number;
    calories: number;
  }>;
};

const skeletonKeys = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/meals/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {skeletonKeys.map((key) => (
            <Skeleton className="h-32" key={key} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[380px]" />
          <Skeleton className="h-[380px]" />
        </div>
      </div>
    );
  }

  if (!stats || stats.totalMeals === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="flex items-center gap-3 font-bold text-3xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Your nutritional insights at a glance
          </p>
        </div>
        <EmptyState type="dashboard" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-3 font-bold text-3xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your nutritional insights at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          gradient="from-violet-500 to-fuchsia-500"
          icon={<UtensilsCrossed className="h-6 w-6 text-white" />}
          subtitle="meals analyzed"
          title="Total Meals"
          value={stats.totalMeals}
        />
        <StatCard
          gradient="from-emerald-500 to-green-600"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          subtitle="out of 100"
          title="Avg Health Score"
          value={stats.averages.healthScore}
        />
        <StatCard
          gradient="from-orange-500 to-red-500"
          icon={<Flame className="h-6 w-6 text-white" />}
          subtitle="kcal per meal"
          title="Avg Calories"
          value={stats.averages.calories}
        />
        <StatCard
          gradient="from-rose-500 to-pink-600"
          icon={<Drumstick className="h-6 w-6 text-white" />}
          subtitle="per meal"
          title="Avg Protein"
          value={`${stats.averages.protein}g`}
        />
      </div>

      {/* Secondary Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-yellow-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg Carbs</p>
                <p className="font-bold text-2xl">{stats.averages.carbs}g</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600">
                <Wheat className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg Fats</p>
                <p className="font-bold text-2xl">{stats.averages.fats}g</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600">
                <Droplets className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-green-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Excellent Meals</p>
                <p className="font-bold text-2xl">
                  {stats.distribution.excellent}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <HealthScoreChart data={stats.recentMeals} />
        <ScoreDistributionChart data={stats.distribution} />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <MacroAverageChart
          data={{
            protein: stats.averages.protein,
            carbs: stats.averages.carbs,
            fats: stats.averages.fats,
          }}
        />
      </div>
    </div>
  );
}
