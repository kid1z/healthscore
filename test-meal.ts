// use npx tsx test-meal.ts

import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    console.log("Attempting to connect to database...");
    const count = await prisma.meal.count();
    console.log(`Successfully connected! Found ${count} meals.`);

    // Ensure a test user exists

    // create a test meal
    const newMeal = await prisma.meal.create({
      data: {
        id: `meal-${Date.now()}`,
        userId: "1",
        name: "Test Meal",
        dishName: "Test Dish",
        calories: 450,
        protein: 25,
        carbs: 50,
        fats: 15,
        healthScore: 85,
        ingredients: ["ingredient1", "ingredient2", "ingredient3"],
        imageUrl:
          "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcRCkflBhWmAY3g_uNcV4HvZBMIcUAHgNJoFv9GcIijlRHPh4KwdXpmnELJntB22IDOJ2Yx_jUYqJj8h-LXOsrE",
        updatedAt: new Date(),
      },
    });
    console.log("Created test meal:", newMeal);

    // Try a query similar to the route
    const meals = await prisma.meal.findMany({
      take: 1,
    });
    console.log(
      "Successfully fetched a meal:",
      meals.length > 0 ? "Yes" : "No"
    );
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
