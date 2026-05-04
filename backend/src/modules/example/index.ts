import Elysia from "elysia";

export const ExampleExports = new Elysia({
	name: "ExampleExports",
})
	.decorate(() => ({}))
	.as("scoped");
