import path from "node:path";
import { MailProvidersEnum } from "@hyoretsu/providers";
import { Value } from "@sinclair/typebox/value";
import { t, type UnwrapSchema } from "elysia";
import { NodeEnv } from "@/shared/types";

const defaultPort = "3333";
const port = (process.env.PORT ?? defaultPort) as string;

const defaultApiUrl = `http://localhost:${port}`;
const apiUrl = (process.env.API_URL ?? defaultApiUrl) as string;

export const envSchema = t.Object({
	API_URL: t.Optional(
		t.String({
			default: defaultApiUrl,
			format: "uri",
		}),
	),
	APP_URL: t.Optional(
		t.String({
			default: "http://localhost:3000",
			format: "uri",
		}),
	),
	BETTER_AUTH_SECRETS: t.Optional(t.String()),
	BETTER_AUTH_URL: t.Optional(
		t.String({
			default: `${apiUrl}`,
		}),
	),
	CORS_WHITELIST: t.Optional(
		t.String({
			default: "*",
		}),
	),
	DATABASE_URL: t.String({ format: "uri" }),
	MAIL_DRIVER: t.Enum(MailProvidersEnum),
	MAIL_HOST: t.String(),
	MAIL_PASS: t.String(),
	MAIL_PORT: t.String(),
	MAIL_USER: t.String(),
	NODE_ENV: t.Optional(
		t.Enum(NodeEnv, {
			default: NodeEnv.Production,
		}),
	),
	PORT: t.Optional(t.Numeric({ default: defaultPort })),
	RESEND_API_KEY: t.Optional(t.String()),
	S3_ACCESS_KEY_ID: t.Optional(t.String()),
	S3_BUCKET: t.Optional(t.String()),
	S3_ENDPOINT: t.Optional(
		t.String({
			format: "uri",
		}),
	),
	S3_SECRET_ACCESS_KEY: t.Optional(t.String()),
	STATIC_DIR: t.Optional(
		t.String({
			default: path.resolve(__dirname, "..", "static"),
		}),
	),
	// STORAGE_DRIVER: t.Enum(StorageProvidersEnum),
});

declare global {
	namespace NodeJS {
		interface ProcessEnv extends UnwrapSchema<typeof envSchema> {}
	}
}

Value.Default(envSchema, process.env);
