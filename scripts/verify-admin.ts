import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@nexus-tech.info").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD ?? "AdminChangeMe123!";

  console.log("--- Admin login check ---");
  console.log("ADMIN_EMAIL (used):", email);
  console.log("ADMIN_PASSWORD set:", Boolean(process.env.ADMIN_PASSWORD));
  console.log("ADMIN_PASSWORD length:", password.length);
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL ?? "(not set)");
  console.log("NEXTAUTH_SECRET set:", Boolean(process.env.NEXTAUTH_SECRET));

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("FAIL: No user with this email in database.");
    const all = await prisma.user.findMany({
      select: { email: true, role: true, active: true },
    });
    console.log("Users in DB:", all);
    return;
  }

  console.log("User found:", user.email, "role:", user.role, "active:", user.active);
  const ok = await bcrypt.compare(password, user.passwordHash);
  console.log(ok ? "PASS: Password matches ADMIN_PASSWORD — login should work." : "FAIL: Password does NOT match ADMIN_PASSWORD. Run: npm run db:seed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
