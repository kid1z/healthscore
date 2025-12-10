import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import { analyzeFood } from "@/lib/gemini";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid image type. Please upload JPEG, PNG, WebP, or GIF." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Convert file to base64 for Gemini
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Analyze with Gemini
    const analysis = await analyzeFood(base64, file.type);

    // Save image to public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    // Save to database
    const meal = await prisma.meal.create({
      data: {
        imageUrl,
        imagePath: filePath,
        dishName: analysis.dishName,
        ingredients: JSON.stringify(analysis.ingredients),
        calories: analysis.calories,
        protein: analysis.protein,
        carbs: analysis.carbs,
        fats: analysis.fats,
        fiber: analysis.fiber,
        sugar: analysis.sugar,
        sodium: analysis.sodium,
        healthScore: analysis.healthScore,
        analysis: analysis.analysis,
      },
    });

    return NextResponse.json({
      success: true,
      meal: {
        ...meal,
        ingredients: JSON.parse(meal.ingredients),
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to analyze image",
      },
      { status: 500 }
    );
  }
}
