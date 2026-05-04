import { createPermix, type PermixDefinition } from "permix";

type ExampleRole = "owner" | "collaborator";

interface ExamplePermissionSchema extends PermixDefinition {
	example: {
		action: "something";
	};
}

export function createExamplePermissions(role: ExampleRole) {
	const permix = createPermix<ExamplePermissionSchema>();
	const isOwner = role === "owner";

	permix.setup({
		example: {
			something: isOwner,
		},
	});

	return permix;
}
