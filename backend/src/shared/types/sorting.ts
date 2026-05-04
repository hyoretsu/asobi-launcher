export enum SortOrder {
	ASC = "asc",
	DESC = "desc",
}

export const sortNumber: Record<SortOrder, 1 | -1> = {
	[SortOrder.ASC]: 1,
	[SortOrder.DESC]: -1,
};
