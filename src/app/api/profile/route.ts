import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  // biome-ignore lint/correctness/noUnusedFunctionParameters: <na>
  request: NextRequest
) {
  try {
    const id = "b2e41dd8-74aa-4aec-a503-111d2f49461f";

    // Fetch user with today's meals
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      bmr: user.bmr,
      weight: user.weight,
      height: user.height,
      age: user.age,
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
