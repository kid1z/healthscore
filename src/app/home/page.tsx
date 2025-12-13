"use client";

import { Apple, Clock, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { HealthScoreDisplay } from "@/components/health-score-display";
import { ImageUploader } from "@/components/image-uploader";
import { IngredientsList } from "@/components/ingredients-list";
import { NutritionCard } from "@/components/nutrition-card";
import RotatingText from "@/components/rotating-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type MealResult = {
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
};

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MealResult | null>(null);

  const analyzeImage = useCallback(async (file: File) => {
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to analyze image");
      }

      const data = await response.json();
      setResult(data.meal);
      toast.success("Analysis complete!", {
        description: `${data.meal.dishName} - Health Score: ${data.meal.healthScore}`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleImageSelect = useCallback(
    (file: File) => {
      setSelectedFile(file);
      setResult(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Auto-analyze
      analyzeImage(file);
    },
    [analyzeImage]
  );

  const handleClear = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  }, [previewUrl]);

  const handleReanalyze = useCallback(() => {
    if (selectedFile) {
      setResult(null);
      analyzeImage(selectedFile);
    }
  }, [selectedFile, analyzeImage]);

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-transparent" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4 py-12">
          <div className="mb-10 text-center">
            <LayoutGroup>
              <motion.p
                className="mb-2 flex items-center justify-center gap-2 text-3xl md:text-4xl lg:text-5xl"
                layout
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                <motion.span
                  className="font-bold text-stone-700 md:text-5xl lg:text-6xl dark:text-white"
                  layout
                >
                  Analyze Your
                </motion.span>
                <RotatingText
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-120%", opacity: 0 }}
                  initial={{ y: "100%", opacity: 0 }}
                  mainClassName="px-2 sm:px-2 md:px-3 bg-violet-400/10 backdrop-blur-md text-violet-500 dark:text-violet-400 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg font-bold text-3xl md:text-5xl lg:text-6xl"
                  rotationInterval={2000}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  staggerDuration={0.025}
                  staggerFrom={"last"}
                  texts={["Health", "Meal", "Dinner", "Life"]}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                />
              </motion.p>
            </LayoutGroup>
            {/* <h1 className="mb-4 font-bold text-4xl md:text-5xl lg:text-6xl">
              Analyze Your{" "}
              <span className="bg-pink-700 bg-clip-text text-transparent">
                Food Instantly
              </span>
            </h1> */}
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Upload a photo of your meal and get instant AI-powered nutritional
              analysis with a comprehensive health score.
            </p>
          </div>

          {/* Upload Area */}
          <div className="mx-auto max-w-2xl">
            <ImageUploader
              isLoading={isAnalyzing}
              onClear={handleClear}
              onImageSelect={handleImageSelect}
              selectedImage={previewUrl}
            />

            {previewUrl !== null && !isAnalyzing && !result ? (
              <div className="mt-4 text-center">
                <Button
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  onClick={() => {
                    if (selectedFile) {
                      analyzeImage(selectedFile);
                    }
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze This Meal
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result ? (
        <section className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-bold text-2xl">Analysis Results</h2>
            <Button onClick={handleReanalyze} size="sm" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Re-analyze
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Health Score */}
            <div className="lg:col-span-1">
              <HealthScoreDisplay score={result.healthScore} />
            </div>

            {/* Nutrition */}
            <div className="lg:col-span-2">
              <NutritionCard
                calories={result.calories}
                carbs={result.carbs}
                fats={result.fats}
                fiber={result.fiber}
                protein={result.protein}
                sodium={result.sodium}
                sugar={result.sugar}
              />
            </div>
          </div>

          <div className="mt-6">
            <IngredientsList
              analysis={result.analysis}
              dishName={result.dishName}
              ingredients={result.ingredients}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              className="gap-2"
              onClick={handleClear}
              size="lg"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
              Analyze Another Meal
            </Button>
          </div>
        </section>
      ) : null}

      {/* Features Section - only show when no result */}
      {result || previewUrl ? null : (
        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="group hover:-translate-y-1 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 transition-transform group-hover:scale-110">
                  <Apple className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Instant Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Get detailed nutritional breakdown in seconds. Our AI
                  identifies ingredients and calculates macros automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:-translate-y-1 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 transition-transform group-hover:scale-110">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Health Score</h3>
                <p className="text-muted-foreground text-sm">
                  Each meal gets a 0-100 health score based on nutritional
                  value, helping you make better food choices.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:-translate-y-1 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 transition-transform group-hover:scale-110">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Track Progress</h3>
                <p className="text-muted-foreground text-sm">
                  View your meal history and track your nutritional trends over
                  time with beautiful charts and insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
