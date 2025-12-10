-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "imagePath" TEXT,
    "dishName" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "calories" REAL NOT NULL,
    "protein" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "fats" REAL NOT NULL,
    "fiber" REAL,
    "sugar" REAL,
    "sodium" REAL,
    "healthScore" INTEGER NOT NULL,
    "analysis" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Meal_createdAt_idx" ON "Meal"("createdAt");

-- CreateIndex
CREATE INDEX "Meal_healthScore_idx" ON "Meal"("healthScore");
