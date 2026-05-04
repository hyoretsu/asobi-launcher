import Elysia from "elysia";
import { AuthGuard } from "@/modules/users/guards";
import { DomainError } from "@/shared/errors";
import { GlobalPlugin } from "../global";

export const UserRoutes = new Elysia({ name: "UserRoutes" })
	.use([GlobalPlugin])
	.guard({
		error: ({ error, status }) => {
			if (error instanceof DomainError) {
				return status(error.status, {
					error: error.message,
					status: error.status,
				});
			}
		},
	})
	.resolve(async ({ request }) => AuthGuard.execute(request.headers))
	.as("scoped");
