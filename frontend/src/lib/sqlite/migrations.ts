import { getDbClient } from "./client";

export async function runSqliteMigrations() {
	const db = await getDbClient();
	await db.execute(
		"CREATE TABLE IF NOT EXISTS games (id TEXT PRIMARY KEY, name TEXT, command TEXT, args TEXT, env TEXT, hotkey TEXT)",
	);
	await db.execute(
		"CREATE TABLE IF NOT EXISTS game_runtime (game_id TEXT PRIMARY KEY, seconds INTEGER NOT NULL DEFAULT 0)",
	);
}
