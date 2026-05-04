import Database from "@tauri-apps/plugin-sql";

const DB_URL = "sqlite:asobi.sqlite";

let dbClient: Database | null = null;

export async function getDbClient() {
	if (dbClient) return dbClient;
	dbClient = await Database.load(DB_URL);
	return dbClient;
}
