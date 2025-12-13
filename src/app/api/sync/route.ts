import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, step, sitting } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("===== today ======= ", today);
    console.log("===== step ======= ", step);
    console.log("===== sitting ======= ", sitting);
    console.log("===== id ======= ", id);

    // Upsert exercise record for today
    const exercise = await prisma.exercise.upsert({
      where: {
        userId_date: {
          userId: id,
          date: today,
        },
      },
      update: {
        step: step ?? 0,
        sitting: sitting ?? 0,
      },
      create: {
        id: crypto.randomUUID(),
        userId: id,
        date: today,
        step: step ?? 0,
        sitting: sitting ?? 0,
      },
    });

    return NextResponse.json({
      success: true,
      exercise,
    });
  } catch (error) {
    console.error("Error syncing exercise data:", error);
    return NextResponse.json(
      { error: "Failed to sync exercise data" },
      { status: 500 }
    );
  }
}
