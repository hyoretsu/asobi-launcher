import ky from "ky";

export interface RequestLocation {
	country: string | null;
}

export async function getRequestLocation(): Promise<RequestLocation> {
	const response = await ky.get(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"}/location`, {
		credentials: "include",
	});

	if (!response.ok) {
		return { country: null };
	}

	return response.json() as Promise<RequestLocation>;
}
