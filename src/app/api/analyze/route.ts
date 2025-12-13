/** biome-ignore-all lint/style/noNonNullAssertion: <na> */
import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { toast } from "sonner";
import { analyzeFood } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    const bucket = "images";

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const pathS3 = `uploads/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from("images")
      .createSignedUploadUrl(pathS3);

    if (error || !data) {
      toast.error("Supabase upload URL error");
      throw new Error("Failed to get upload URL");
    }

    // Upload to Supabase Storage
    const uploadResponse = await fetch(data.signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: buffer,
    });

    if (!uploadResponse.ok) {
      toast.error("Supabase upload error");
      throw new Error("Failed to upload image");
    }

    // Get public URL
    const { data: pub } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(pathS3);

    const imageUrl = pub?.publicUrl ?? null;

    // Save to database
    const meal = await prisma.meal.create({
      data: {
        id: `meal-${Date.now()}`,
        userId: "1",
        imageUrl,
        name: analysis.dishName,
        updatedAt: new Date(),
        imagePath: imageUrl,
        dishName: analysis.dishName,
        ingredients: analysis.ingredients,
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
        ingredients: meal.ingredients,
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
