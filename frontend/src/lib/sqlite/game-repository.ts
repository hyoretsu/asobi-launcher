import { getDbClient } from "./client";
import type { GameEntity } from "./types";

export class SqliteGameRepository {
	async listGames() {
		const db = await getDbClient();
		return db.select<GameEntity[]>(
			"SELECT id, name, command, args, env, hotkey FROM games ORDER BY rowid DESC",
		);
	}

	async createGame(game: GameEntity) {
		const db = await getDbClient();
		await db.execute("INSERT INTO games (id, name, command, args, env, hotkey) VALUES (?, ?, ?, ?, ?, ?)", [
			game.id,
			game.name,
			game.command,
			game.args,
			game.env,
			game.hotkey,
		]);
	}
}
