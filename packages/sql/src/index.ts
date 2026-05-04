import { PrismaPg } from "@prisma/adapter-pg";
import { Kysely, PostgresAdapter, PostgresIntrospector, PostgresQueryCompiler } from "kysely";
import kyselyExtension from "prisma-extension-kysely";
import type { DB } from "../out/kysely/types";
import type { PrismaClient } from "../out/prisma/client.ts";
import "dotenv/config";

const env = globalThis.process?.env;

const databaseUrl = env?.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL is required for Prisma adapter");
}

export const adapter = new PrismaPg({
	connectionString: databaseUrl,
	idleTimeoutMillis: Number(env?.PRISMA_POOL_IDLE_TIMEOUT_MS || 30000),
	max: Number(env?.PRISMA_POOL_MAX || 20),
	min: Number(env?.PRISMA_POOL_MIN || 2),
});

export const prismaExtensionKysely = () =>
	kyselyExtension({
		kysely: driver =>
			new Kysely<DB>({
				dialect: {
					createAdapter: () => new PostgresAdapter(),
					createDriver: () => driver,
					createIntrospector: db => new PostgresIntrospector(db),
					createQueryCompiler: () => new PostgresQueryCompiler(),
				},
			}),
	});

export type KyselyInstance = Kysely<DB>;
export type PrismaClientInstance = InstanceType<typeof PrismaClient>;

export * from "../out/prisma/client.ts";
