"use client";

import { Sparkles, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UploadAreaSkeleton() {
  return (
    <Card className="border-2 border-muted-foreground/25 border-dashed">
      <CardContent className="p-12">
        <div className="flex flex-col items-center justify-center">
          <Skeleton className="mb-6 h-24 w-24 rounded-full" />
          <Skeleton className="mb-2 h-6 w-48" />
          <Skeleton className="mb-6 h-4 w-64" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const skeletonKeys = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

export function ResultSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="flex flex-col items-center p-6">
          <Skeleton className="mb-4 h-40 w-40 rounded-full" />
          <Skeleton className="mb-2 h-6 w-24" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="grid grid-cols-2 gap-3">
            {skeletonKeys.map((key) => (
              <Skeleton className="h-24 rounded-xl" key={key} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function MealCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
      <CardContent className="p-4">
        <Skeleton className="mb-3 h-4 w-24" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState({ type }: { type: "history" | "dashboard" }) {
  return (
    <Card className="p-12">
      <CardContent className="flex flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
          <Sparkles className="h-10 w-10 text-violet-500" />
        </div>
        <h3 className="mb-2 font-semibold text-xl">No meals analyzed yet</h3>
        <p className="mb-6 max-w-sm text-muted-foreground">
          {type === "history"
            ? "Upload your first food photo to start tracking your nutritional journey."
            : "Analyze some meals to see your health statistics and trends here."}
        </p>
        <Link href="/home">
          <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
            <Upload className="mr-2 h-4 w-4" />
            Analyze Your First Meal
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
