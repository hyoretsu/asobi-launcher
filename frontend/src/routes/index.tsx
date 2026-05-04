import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
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

function IndexPage() {
	const [games, setGames] = useState<Game[]>([]);
	const [form, setForm] = useState<Game>({ args: "", command: "", env: "", hotkey: "", id: "", name: "" });
	const [selectedId, setSelectedId] = useState<string>("");
	const [runtime, setRuntime] = useState<number>(0);

	const selectedGame = useMemo(() => games.find(g => g.id === selectedId), [games, selectedId]);

	const addGame = (event: FormEvent) => {
		event.preventDefault();
		if (!form.name.trim() || !form.command.trim()) return;
		const newGame = { ...form, id: crypto.randomUUID() };
		setGames(prev => [newGame, ...prev]);
		setForm({ args: "", command: "", env: "", hotkey: "", id: "", name: "" });
	};

	const launchGame = async (game: Game) => {
		const seconds = await invoke<number>("launch_game", { game });
		setRuntime(seconds);
		setSelectedId(game.id);
	};

	const refreshRuntime = async () => {
		const seconds = await invoke<number>("get_runtime_seconds", { gameId: selectedId });
		setRuntime(seconds);
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<main className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 p-4 md:p-6 xl:grid xl:grid-cols-[1.2fr_0.8fr] xl:gap-8">
				<Card className="border-slate-800 bg-slate-900/70">
					<CardHeader>
						<CardTitle className="text-2xl">Asobi Launcher</CardTitle>
						<CardDescription>
							Layout desktop responsivo para 16:9 e 21:9 com redimensionamento fluido.
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
									<Input
										onChange={e => setForm({ ...form, command: e.target.value })}
										placeholder="ex: /usr/bin/game"
										value={form.command}
									/>
								</Label>
								<Label>
									Args
									<Input
										onChange={e => setForm({ ...form, args: e.target.value })}
										placeholder="--windowed --lang=pt"
										value={form.args}
									/>
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
									<Input
										onChange={e => setForm({ ...form, hotkey: e.target.value })}
										placeholder="Ctrl+Shift+1"
										value={form.hotkey}
									/>
								</Label>
								<Button className="w-full" type="submit">
									Salvar jogo
								</Button>
							</form>
						</CardContent>
					</Card>

					<Card className="border-slate-800 bg-slate-900/70">
						<CardHeader>
							<CardTitle>Monitoramento / tempo aberto</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<p>
								Jogo ativo: <strong>{selectedGame?.name ?? "nenhum"}</strong>
							</p>
							<p>
								Tempo acumulado: <strong>{runtime}s</strong>
							</p>
							<Button disabled={!selectedId} onClick={refreshRuntime} type="button" variant="outline">
								Atualizar tempo
							</Button>
							<p className="text-slate-400">
								A app segue em background/tray e persiste o tempo em SQLite via backend Tauri.
							</p>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}

export const Route = createFileRoute("/")({ component: IndexPage });
