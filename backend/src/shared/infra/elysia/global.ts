import { mailProviders } from "@hyoretsu/providers";
import Elysia from "elysia";
import type { ElysiaCookie } from "elysia/cookies";
import { ip } from "elysia-ip";
import { Cookies } from "../../types";
import { prisma } from "../sql";

const isDev = process.env.NODE_ENV === "development";

export const GlobalPlugin = new Elysia({
	name: "GlobalPlugin",
})
	.use(ip({ headersFirst: true }))
	.guard({
		cookie: Cookies,
	})
	.decorate({
		mailProvider: new mailProviders[process.env.MAIL_DRIVER](),
		prisma,
		// storageProvider: new storageProviders[process.env.STORAGE_DRIVER](),
	})
	.derive(() => ({
		setCookies: {} as Record<string, string | ElysiaCookie>,
	}))
	.onAfterHandle(({ cookie, responseValue, setCookies }) => {
		if (setCookies) {
			for (let [name, options] of Object.entries(setCookies)) {
				if (typeof options !== "object") {
					options = { value: options };
				}

				options.domain ??= process.env.BASE_DOMAIN || process.env.DOMAIN || "localhost";
				options.httpOnly ??= true;
				options.maxAge ??= 400 * 24 * 60 * 60;
				options.path ??= "/";
				options.sameSite ??= isDev ? "lax" : "none";
				options.secure ??= !isDev;

				cookie[name]?.set(options);
			}
		}

		return responseValue ?? {};
	})
	.as("global");
