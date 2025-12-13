"use server";

import { prisma } from "@/lib/prisma";

type ProfileData = {
  name: string;
  gender: "Male" | "Female";
  age: number;
  height: number;
  weight: number;
  bmr: string;
};

export async function upsertUserProfile(data: ProfileData) {
  try {
    const user = await prisma.user.upsert({
      where: { name: data.name },
      update: {
        gender: data.gender,
        age: data.age,
        height: data.height,
        weight: data.weight,
        bmr: data.bmr,
      },
      create: {
        id: crypto.randomUUID(),
        name: data.name,
        gender: data.gender,
        age: data.age,
        height: data.height,
        weight: data.weight,
        bmr: data.bmr,
        updatedAt: new Date(),
      },
    });

    return { success: true, user, isNew: user.createdAt === user.updatedAt };
  } catch (error) {
    console.error("Failed to upsert user profile:", error);
    return { success: false, error: "Failed to save profile" };
  }
}
