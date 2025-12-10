"use client";

import { ChefHat, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type IngredientsListProps = {
  dishName: string;
  ingredients: string[];
  analysis?: string | null;
};

export function IngredientsList({
  dishName,
  ingredients,
  analysis,
}: IngredientsListProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ChefHat className="h-5 w-5 text-violet-500" />
              {dishName}
            </CardTitle>
            <p className="mt-1 text-muted-foreground text-sm">
              {ingredients.length} ingredients identified
            </p>
          </div>
          <Badge className="shrink-0" variant="outline">
            <Utensils className="mr-1 h-3 w-3" />
            AI Analysis
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div
                className="flex items-center gap-3 rounded-lg bg-muted/50 p-2 transition-colors hover:bg-muted"
                key={ingredient}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                  <span className="font-semibold text-violet-600 text-xs dark:text-violet-400">
                    {ingredients.indexOf(ingredient) + 1}
                  </span>
                </div>
                <span className="text-sm">{ingredient}</span>
              </div>
            ))}
          </div>
        </ScrollArea>

        {analysis ? (
          <div className="border-t pt-4">
            <h4 className="mb-2 flex items-center gap-2 font-medium text-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              AI Assessment
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {analysis}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
