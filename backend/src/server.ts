import { mkdir } from "node:fs/promises";
import { ExampleController } from "./modules/example/infra";
import { app } from "./shared/infra/elysia";

await mkdir(process.env.STATIC_DIR!, { recursive: true });

export const server = app.use([ExampleController]);
