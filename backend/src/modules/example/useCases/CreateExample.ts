import type { PrismaInstance } from "@/shared/infra/sql";
import type { CreateExampleDTO, CreateExampleReturn } from "../dtos";

export class CreateExample {
	constructor(readonly _prisma: PrismaInstance) {}

	async execute(data: CreateExampleDTO): Promise<CreateExampleReturn> {
		return {};
	}
}
