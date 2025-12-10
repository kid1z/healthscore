import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalMeals,
      avgHealthScore,
      avgCalories,
      avgProtein,
      avgCarbs,
      avgFats,
      excellentMeals,
      goodMeals,
      moderateMeals,
      poorMeals,
      recentMeals,
    ] = await Promise.all([
      prisma.meal.count(),
      prisma.meal.aggregate({ _avg: { healthScore: true } }),
      prisma.meal.aggregate({ _avg: { calories: true } }),
      prisma.meal.aggregate({ _avg: { protein: true } }),
      prisma.meal.aggregate({ _avg: { carbs: true } }),
      prisma.meal.aggregate({ _avg: { fats: true } }),
      prisma.meal.count({ where: { healthScore: { gte: 90 } } }),
      prisma.meal.count({ where: { healthScore: { gte: 70, lt: 90 } } }),
      prisma.meal.count({ where: { healthScore: { gte: 50, lt: 70 } } }),
      prisma.meal.count({ where: { healthScore: { lt: 50 } } }),
      prisma.meal.findMany({
        orderBy: { createdAt: "desc" },
        take: 7,
        select: {
          createdAt: true,
          healthScore: true,
          calories: true,
        },
      }),
    ]);

    // Get daily averages for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyData = await prisma.meal.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      _avg: {
        healthScore: true,
        calories: true,
      },
      _count: true,
    });

    return NextResponse.json({
      totalMeals,
      averages: {
        healthScore: Math.round(avgHealthScore._avg.healthScore || 0),
        calories: Math.round(avgCalories._avg.calories || 0),
        protein: Math.round(avgProtein._avg.protein || 0),
        carbs: Math.round(avgCarbs._avg.carbs || 0),
        fats: Math.round(avgFats._avg.fats || 0),
      },
      distribution: {
        excellent: excellentMeals,
        good: goodMeals,
        moderate: moderateMeals,
        poor: poorMeals,
      },
      recentMeals: recentMeals.map((meal) => ({
        date: meal.createdAt,
        healthScore: meal.healthScore,
        calories: meal.calories,
      })),
      dailyData,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
