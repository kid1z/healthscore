import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "12", 10);
    const minScore = searchParams.get("minScore");
    const maxScore = searchParams.get("maxScore");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: Record<string, unknown> = {};

    if (minScore || maxScore) {
      where.healthScore = {};
      if (minScore) {
        (where.healthScore as Record<string, number>).gte = Number.parseInt(
          minScore,
          10
        );
      }
      if (maxScore) {
        (where.healthScore as Record<string, number>).lte = Number.parseInt(
          maxScore,
          10
        );
      }
    }

    const [meals, total] = await Promise.all([
      prisma.meal.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.meal.count({ where }),
    ]);

    const formattedMeals = meals.map((meal) => {
      let ingredients = meal.ingredients;

      // Only parse if it's a string
      if (typeof ingredients === "string") {
        try {
          ingredients = JSON.parse(ingredients);
        } catch {
          // If parsing fails, keep original value
          console.error("Failed to parse ingredients for meal:", meal.id);
        }
      }

      return {
        ...meal,
        ingredients,
      };
    });

    return NextResponse.json({
      meals: formattedMeals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch meals",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number.parseInt(searchParams.get("id") || "", 10);

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "No meal ID provided" },
        { status: 400 }
      );
    }

    await prisma.meal.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting meal:", error);
    return NextResponse.json(
      { error: "Failed to delete meal" },
      { status: 500 }
    );
  }
}
