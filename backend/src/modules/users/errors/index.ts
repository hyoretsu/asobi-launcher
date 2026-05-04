import { createEnumFromArray } from "@hyoretsu/utils";
import { StatusCodes } from "http-status-codes";

export const UserErrors = createEnumFromArray(["WRONG_CREDENTIALS"]);

export const UserErrorsStatusCodes: Record<keyof typeof UserErrors, StatusCodes> = {
	WRONG_CREDENTIALS: StatusCodes.UNAUTHORIZED,
};
