import cors from "@elysiajs/cors";
import staticPlugin from "@elysiajs/static";
import Elysia from "elysia";
import { envSchema } from "@/env";
import { auth } from "@/shared/infra/betterAuth";
import { GlobalPlugin } from "./global";
import { OpenAPI } from "./openapi";

export const app = new Elysia({ normalize: "typebox" })
	.env(envSchema)
	.use([
		cors({
			credentials: true,
			origin: process.env.CORS_WHITELIST!.split(","),
		}),
		staticPlugin({
			assets: process.env.STATIC_DIR!,
			prefix: "/static",
		}),
		GlobalPlugin,
	])
	.all("/auth/*", ({ request }) => auth.handler(request))
	.use(OpenAPI);
