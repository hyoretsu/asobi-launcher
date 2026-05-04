import { t } from "elysia";
import { CreateExampleQuery } from "./query";

export const CreateExampleDTO = t.Object({ ...CreateExampleQuery.properties });
export type CreateExampleDTO = typeof CreateExampleDTO.static;
