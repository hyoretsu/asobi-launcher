import { t } from "elysia";

export const PaginationQuery = t.Object({
	limit: t.Optional(t.Numeric()),
	page: t.Optional(t.Numeric()),
});
export type PaginationQuery = typeof PaginationQuery.static;

export const PaginatedResponse = t.Object({
	pages: t.Number(),
	total: t.Number(),
});
export type PaginatedResponse = typeof PaginatedResponse.static;
