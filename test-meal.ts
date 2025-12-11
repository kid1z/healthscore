// use npx tsx test-meal.ts

import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    console.log("Attempting to connect to database...");
    const count = await prisma.meal.count();
    console.log(`Successfully connected! Found ${count} meals.`);

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
