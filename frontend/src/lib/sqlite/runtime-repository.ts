import { getDbClient } from "./client";

export class SqliteRuntimeRepository {
	async addSeconds(gameId: string, seconds: number) {
		const db = await getDbClient();
		await db.execute(
			"INSERT INTO game_runtime (game_id, seconds) VALUES (?, ?) ON CONFLICT(game_id) DO UPDATE SET seconds = seconds + excluded.seconds",
			[gameId, seconds],
		);
	}

	async getRuntime(gameId: string) {
		const db = await getDbClient();
		const [row] = await db.select<Array<{ seconds: number }>>(
			"SELECT seconds FROM game_runtime WHERE game_id = ?",
			[gameId],
		);
		return row?.seconds ?? 0;
	}
}
