import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "uelischutz@gmail.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD ?? "AdminChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: Role.ADMIN, active: true },
    create: {
      email,
      passwordHash,
      role: Role.ADMIN,
      firstName: "Admin",
      lastName: "Nexus",
      active: true,
    },
  });

  console.log(`Admin ready: ${admin.email}`);
  console.log(`Password synced from ADMIN_PASSWORD in .env (re-run seed after changing it).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
