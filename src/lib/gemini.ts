import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type NutritionAnalysis = {
  dishName: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  healthScore: number;
  analysis: string;
};

export async function analyzeFood(
  imageBase64: string,
  mimeType: string
): Promise<NutritionAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a professional nutritionist and food analyst. Analyze this food image and provide detailed nutritional information.

Return your analysis in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{
  "dishName": "Name of the dish",
  "ingredients": ["ingredient1", "ingredient2", ...],
  "calories": <number in kcal>,
  "protein": <number in grams>,
  "carbs": <number in grams>,
  "fats": <number in grams>,
  "fiber": <number in grams>,
  "sugar": <number in grams>,
  "sodium": <number in mg>,
  "healthScore": <number from 0-100>,
  "analysis": "A brief 2-3 sentence analysis of the meal's nutritional value and health impact"
}

Health Score Guidelines:
- 90-100: Excellent - Very healthy, nutrient-dense, minimal processing
- 70-89: Good - Healthy with minor concerns
- 50-69: Moderate - Some healthy aspects but also concerns
- 30-49: Below Average - Multiple nutritional concerns
- 0-29: Poor - Highly processed, high sugar/sodium, low nutritional value

Be realistic with your estimates. If you cannot identify the food, still provide your best estimate based on what you can see.`;

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean up the response - remove any markdown code blocks
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const parsed = JSON.parse(cleanedText) as NutritionAnalysis;

    // Validate and clamp health score
    parsed.healthScore = Math.max(0, Math.min(100, parsed.healthScore));

    return parsed;
  } catch (error) {
    console.error("Error analyzing food:", error);
    throw new Error("Failed to analyze food image. Please try again.");
  }
}
