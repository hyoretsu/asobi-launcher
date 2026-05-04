import { createFileRoute } from "@tanstack/react-router";
import { AuthExampleCard } from "./components/AuthExampleCard";
import { HeroSection } from "./components/HeroSection";
import { PatternCard } from "./components/PatternCard";

function IndexPage() {
	return (
		<div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10">
			<HeroSection />
			<section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<AuthExampleCard />
				<PatternCard />
			</section>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: IndexPage,
});
