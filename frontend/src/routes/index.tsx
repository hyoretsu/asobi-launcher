import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Game {
	id: string;
	name: string;
	command: string;
	args: string;
	env: string;
	hotkey: string;
}

const DB_URL = "sqlite:asobi.sqlite";

function IndexPage() {
	const [db, setDb] = useState<Database | null>(null);
	const [games, setGames] = useState<Game[]>([]);
	const [form, setForm] = useState<Game>({ args: "", command: "", env: "", hotkey: "", id: "", name: "" });
	const [selectedId, setSelectedId] = useState("");
	const [runtime, setRuntime] = useState(0);

	const selectedGame = useMemo(() => games.find(g => g.id === selectedId), [games, selectedId]);

	useEffect(() => {
		const setup = async () => {
			const database = await Database.load(DB_URL);
			await database.execute(
				"CREATE TABLE IF NOT EXISTS games (id TEXT PRIMARY KEY, name TEXT, command TEXT, args TEXT, env TEXT, hotkey TEXT)",
			);
			await database.execute(
				"CREATE TABLE IF NOT EXISTS game_runtime (game_id TEXT PRIMARY KEY, seconds INTEGER NOT NULL DEFAULT 0)",
			);
			const rows = await database.select<Game[]>(
				"SELECT id, name, command, args, env, hotkey FROM games ORDER BY rowid DESC",
			);
			setGames(rows);
			setDb(database);
		};
		setup();
	}, []);

	const persistGame = async (game: Game) => {
		if (!db) return;
		await db.execute("INSERT INTO games (id, name, command, args, env, hotkey) VALUES (?, ?, ?, ?, ?, ?)", [
			game.id,
			game.name,
			game.command,
			game.args,
			game.env,
			game.hotkey,
		]);
	};

	const addSeconds = async (gameId: string, seconds: number) => {
		if (!db) return;
		await db.execute(
			"INSERT INTO game_runtime (game_id, seconds) VALUES (?, ?) ON CONFLICT(game_id) DO UPDATE SET seconds = seconds + excluded.seconds",
			[gameId, seconds],
		);
		const [row] = await db.select<Array<{ seconds: number }>>(
			"SELECT seconds FROM game_runtime WHERE game_id = ?",
			[gameId],
		);
		setRuntime(row?.seconds ?? 0);
	};

	const getRuntime = async (gameId: string) => {
		if (!db) return;
		const [row] = await db.select<Array<{ seconds: number }>>(
			"SELECT seconds FROM game_runtime WHERE game_id = ?",
			[gameId],
		);
		setRuntime(row?.seconds ?? 0);
	};

	const addGame = async (event: FormEvent) => {
		event.preventDefault();
		if (!form.name.trim() || !form.command.trim()) return;
		const game = { ...form, id: crypto.randomUUID() };
		await persistGame(game);
		setGames(prev => [game, ...prev]);
		setForm({ args: "", command: "", env: "", hotkey: "", id: "", name: "" });
	};

	const launchGame = async (game: Game) => {
		setSelectedId(game.id);
		await getRuntime(game.id);

		const pid = await invoke<number>("launch_game", { game });
		const startedAt = Date.now();

		const poll = window.setInterval(async () => {
			const running = await invoke<boolean>("is_game_running", { pid });
			if (!running) {
				window.clearInterval(poll);
				const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
				await addSeconds(game.id, elapsedSeconds);
			}
		}, 1000);
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<main className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 p-4 md:p-6 xl:grid xl:grid-cols-[1.2fr_0.8fr] xl:gap-8">
				<Card className="border-slate-800 bg-slate-900/70">
					<CardHeader>
						<CardTitle className="text-2xl">Asobi Launcher</CardTitle>
						<CardDescription>
							Desktop-first, responsivo para 16:9 / 21:9 com redimensionamento.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
							{games.map(game => (
								<Card className="border-slate-800 bg-slate-950" key={game.id}>
									<CardContent className="space-y-2 p-4">
										<p className="font-semibold">{game.name}</p>
										<p className="truncate text-slate-400 text-xs">{game.command}</p>
										<p className="text-slate-500 text-xs">Atalho: {game.hotkey || "-"}</p>
										<Button className="w-full" onClick={() => launchGame(game)} type="button">
											Play
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</CardContent>
				</Card>
				<div className="space-y-6">
					<Card className="border-slate-800 bg-slate-900/70">
						<CardHeader>
							<CardTitle>Adicionar jogo manualmente</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="space-y-3" onSubmit={addGame}>
								<Label>
									Nome
									<Input onChange={e => setForm({ ...form, name: e.target.value })} value={form.name} />
								</Label>
								<Label>
									Comando
									<Input onChange={e => setForm({ ...form, command: e.target.value })} value={form.command} />
								</Label>
								<Label>
									Args
									<Input onChange={e => setForm({ ...form, args: e.target.value })} value={form.args} />
								</Label>
								<Label>
									Variáveis de ambiente
									<Input
										onChange={e => setForm({ ...form, env: e.target.value })}
										placeholder="KEY=VALUE;FOO=BAR"
										value={form.env}
									/>
								</Label>
								<Label>
									Atalho
									<Input onChange={e => setForm({ ...form, hotkey: e.target.value })} value={form.hotkey} />
								</Label>
								<Button className="w-full" type="submit">
									Salvar jogo
								</Button>
							</form>
						</CardContent>
					</Card>
					<Card className="border-slate-800 bg-slate-900/70">
						<CardHeader>
							<CardTitle>Tempo acumulado</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								Jogo ativo: <strong>{selectedGame?.name ?? "nenhum"}</strong>
							</p>
							<p>
								Total salvo em SQLite: <strong>{runtime}s</strong>
							</p>
							<Button
								disabled={!selectedId}
								onClick={() => getRuntime(selectedId)}
								type="button"
								variant="outline"
							>
								Atualizar
							</Button>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}

export const Route = createFileRoute("/")({ component: IndexPage });
