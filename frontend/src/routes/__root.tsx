import { createRootRoute, Outlet } from "@tanstack/react-router";

function RootComponent() {
	return (
		<div className="dark min-h-screen bg-background text-foreground">
			<main>
				<Outlet />
			</main>
		</div>
	);
}

export const Route = createRootRoute({
	component: RootComponent,
});
