export interface GameEntity {
	id: string;
	name: string;
	command: string;
	args: string;
	env: string;
	hotkey: string;
}

export interface GameRuntimeEntity {
	gameId: string;
	seconds: number;
}
