import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  // biome-ignore lint/correctness/noUnusedFunctionParameters: <na>
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get start and end of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch user with today's meals
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Meal: {
          where: {
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // console.log("======== users ==========: ", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse ingredients for each meal
    const formattedMeals = user.Meal.map((meal) => {
      let ingredients = meal.ingredients;
      if (typeof ingredients === "string") {
        try {
          ingredients = JSON.parse(ingredients);
        } catch {
          console.error("Failed to parse ingredients for meal:", meal.id);
        }
      }
      return { ...meal, ingredients };
    });

    // Calculate total intake from today's meals
    const totalIntake = formattedMeals.reduce(
      (sum, meal) => sum + (meal.calories || 0),
      0
    );

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        bmr: user.bmr,
        weight: user.weight,
        height: user.height,
        age: user.age,
        // Add other user fields as needed
      },
      meals: formattedMeals,
      totalIntake,
    });
  } catch (error) {
    console.error("Error fetching user and meals:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
