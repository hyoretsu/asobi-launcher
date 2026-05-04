import { server } from "./server";
import { app } from "./shared/infra/elysia";

// Add modules here
server.listen(process.env.PORT || 3333);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
