import { createEnumFromArray } from "@hyoretsu/utils";
import { StatusCodes } from "http-status-codes";

export const ExampleErrors = createEnumFromArray(["ERROR"]);

export const ExampleErrorsStatusCodes: Record<keyof typeof ExampleErrors, StatusCodes> = {
	ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
};
