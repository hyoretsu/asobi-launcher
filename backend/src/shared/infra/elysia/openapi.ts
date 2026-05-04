import openapi from "@elysiajs/openapi";
import Elysia from "elysia";
import packageJson from "@/../../package.json";

export const docsPath = "/docs";

export const OpenAPI = new Elysia().use(
	openapi({
		documentation: {
			info: {
				title: process.env.APP_NAME || packageJson.name,
				version: packageJson.version,
			},
		},
		path: docsPath,
	}),
);
