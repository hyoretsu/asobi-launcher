import Elysia from "elysia";
import { GlobalPlugin } from "@/shared/infra/elysia/global";
import { CreateExampleQuery, CreateExampleReturn } from "../../dtos/CreateExample";
import { CreateExample } from "../../useCases/CreateExample";

export const ExampleController = new Elysia({
	detail: {
		tags: ["Example"],
	},
})
	.use([GlobalPlugin])
	.group("/example", app =>
		app
			.decorate(({ prisma, ...injected }) => ({
				...injected,
				createExample: new CreateExample(prisma),
				prisma,
			}))
			.get("/", async ({ createExample }) => createExample.execute({}), {
				query: CreateExampleQuery,
				result: CreateExampleReturn,
			}),
	);
