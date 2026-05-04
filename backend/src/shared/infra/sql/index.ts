import { adapter, PrismaClient, prismaExtensionKysely } from "sql";

export const prisma = new PrismaClient({ adapter }).$extends(prismaExtensionKysely());
export type PrismaInstance = typeof prisma;
