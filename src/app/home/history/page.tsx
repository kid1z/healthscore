"use client";

import { ChevronLeft, ChevronRight, Filter, History } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { EmptyState, MealCardSkeleton } from "@/components/loading-states";
import { type Meal, MealCard } from "@/components/meal-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const skeletonKeys = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
  "skeleton-6",
  "skeleton-7",
  "skeleton-8",
];

export default function HistoryPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [scoreFilter, setScoreFilter] = useState("all");

  const fetchMeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
      });

      if (scoreFilter !== "all") {
        const [min, max] = scoreFilter.split("-");
        if (min) {
          params.set("minScore", min);
        }
        if (max) {
          params.set("maxScore", max);
        }
      }

      const response = await fetch(`/api/meals?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }

      const data = await response.json();
      setMeals(data.meals);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast.error("Failed to load meal history");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, sortBy, sortOrder, scoreFilter]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/meals?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete meal");
      }

      setMeals((prev) => prev.filter((meal) => meal.id !== id));
      toast.success("Meal deleted successfully");
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast.error("Failed to delete meal");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skeletonKeys.map((key) => (
            <MealCardSkeleton key={key} />
          ))}
        </div>
      );
    }

    if (meals.length === 0) {
      return <EmptyState type="history" />;
    }

    return (
      <>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              size="sm"
              variant="outline"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
              size="sm"
              variant="outline"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 font-bold text-3xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <History className="h-5 w-5 text-white" />
            </div>
            Meal History
          </h1>
          <p className="mt-1 text-muted-foreground">
            Browse and manage your analyzed meals
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select onValueChange={setScoreFilter} value={scoreFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Health Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="90-100">Excellent (90+)</SelectItem>
                <SelectItem value="70-89">Good (70-89)</SelectItem>
                <SelectItem value="50-69">Moderate (50-69)</SelectItem>
                <SelectItem value="0-49">Poor (&lt;50)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select
            onValueChange={(value) => {
              const [by, order] = value.split("-");
              setSortBy(by);
              setSortOrder(order);
            }}
            value={`${sortBy}-${sortOrder}`}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest first</SelectItem>
              <SelectItem value="createdAt-asc">Oldest first</SelectItem>
              <SelectItem value="healthScore-desc">Highest score</SelectItem>
              <SelectItem value="healthScore-asc">Lowest score</SelectItem>
              <SelectItem value="calories-desc">Most calories</SelectItem>
              <SelectItem value="calories-asc">Least calories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      {!isLoading && meals.length > 0 ? (
        <div className="mb-6 flex items-center gap-4">
          <Badge className="py-1.5" variant="secondary">
            {pagination.total} meals analyzed
          </Badge>
          {scoreFilter !== "all" ? (
            <Badge
              className="cursor-pointer py-1.5 hover:bg-destructive/10"
              onClick={() => setScoreFilter("all")}
              variant="outline"
            >
              Clear filter ×
            </Badge>
          ) : null}
        </div>
      ) : null}

      {/* Content */}
      {renderContent()}
    </div>
  );
}
