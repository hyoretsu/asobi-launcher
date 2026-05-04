import type { StatusCodes } from "http-status-codes";
import { ExampleErrors, ExampleErrorsStatusCodes } from "@/modules/example/errors";
import { UserErrors, UserErrorsStatusCodes } from "@/modules/users/errors";

export const DomainErrors = {
	...ExampleErrors,
	...UserErrors,
} as const;
export const DomainErrorsStatusCodes: Record<keyof typeof DomainErrors, StatusCodes> = {
	...ExampleErrorsStatusCodes,
	...UserErrorsStatusCodes,
};

export class DomainError extends Error {
	status: number;

	constructor(
		message: keyof typeof DomainErrors,
		readonly description?: string,
	) {
		super(message);
		this.status = DomainErrorsStatusCodes[message];
	}
}
