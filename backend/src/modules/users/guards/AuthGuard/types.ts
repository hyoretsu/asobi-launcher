import { t } from "elysia";

export const AuthGuardReturn = t.Object({
	companyId: t.Optional(t.String()),
	sessionToken: t.String(),
	userId: t.String(),
});
export type AuthGuardReturn = typeof AuthGuardReturn.static;
