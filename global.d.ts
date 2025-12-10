// global.d.ts

import { PrismaClient } from "@/prisma/generated/client";  // adjust path if needed

declare global {
  var prisma: PrismaClient | undefined;
}

export {};  // ensure this file is treated as a module
