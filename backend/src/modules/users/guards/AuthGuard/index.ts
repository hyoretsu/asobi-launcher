import { DomainError } from "@/shared/errors";
import { auth } from "@/shared/infra/betterAuth";
import { prisma } from "@/shared/infra/sql";
import { UserErrors } from "../../errors";
import type { AuthGuardReturn } from "./types";

export abstract class AuthGuard {
	static async execute(headers: Headers): Promise<AuthGuardReturn> {
		const session = await auth.api.getSession({ headers });
		if (!session) {
			throw new DomainError(UserErrors.WRONG_CREDENTIALS);
		}

		const extended = await prisma.session.findUnique({
			select: { activeCompanyId: true },
			where: { token: session.session.token },
		});

		return {
			companyId: extended?.activeCompanyId ?? undefined,
			sessionToken: session.session.token,
			userId: session.user.id,
		};
	}
}
