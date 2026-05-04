import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./sql";

const algorithm = "argon2id";

export const auth = betterAuth({
	// basePath: "/api/auth",
	basePath: "/auth",
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 0,
		password: {
			hash: password => Bun.password.hash(password, { algorithm }),
			verify: ({ hash, password }) => Bun.password.verify(password, hash, algorithm),
		},
	},
	experimental: {
		joins: true,
	},
	session: {
		additionalFields: {
			activeCompanyId: {
				required: false,
				type: "string",
			},
		},
	},
	trustedOrigins: process.env.CORS_WHITELIST!.split(","),
});
