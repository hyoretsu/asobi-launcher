import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
	datasource: {
		url: process.env.DATABASE_URL!,
	},
	migrations: {
		path: "./src/migrations",
		seed: "npm run ./src/seed/index.ts",
	},
	schema: "./src/models",
});
