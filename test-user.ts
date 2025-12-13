// use npx tsx test-user.ts

import { prisma } from "./src/lib/prisma";

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: "Alice2",
      email: "alice2@prisma.io",
      updatedAt: new Date(),
      bmr: "1500",
    },
  });
  console.log("Created user:", user);

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany();
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
