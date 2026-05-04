import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
	const { t } = useTranslation();

	return (
		<header className="flex flex-col gap-4">
			<Badge>{t("home.hero.badge")}</Badge>
			<div className="space-y-3">
				<h1 className="max-w-3xl font-bold text-4xl tracking-tight sm:text-5xl">{t("home.hero.title")}</h1>
				<p className="max-w-2xl text-lg text-muted-foreground">{t("home.hero.description")}</p>
			</div>
		</header>
	);
}
