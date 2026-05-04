import path from "node:path";
import { createConfig } from "@hyoretsu/kubb/config";
import type { Config } from "@kubb/core";

export default createConfig({
	config: {
		api: {
			jsonPath: path.resolve(__dirname, "../backend/generated/openapi.json"),
			name: "api",
		},
	},
	exclude: [
		{
			pattern: "External",
			type: "tag",
		},
	],
}) as Config;
