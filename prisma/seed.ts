import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("adminpassword", 10); // Secure password

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" }, // Now valid due to @unique constraint
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user created:", admin);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
