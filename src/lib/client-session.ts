import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireClient() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "CLIENT") {
    throw new Error("Unauthorized");
  }
  return session;
}
