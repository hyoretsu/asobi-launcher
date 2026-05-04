import { Trans, useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PatternCard() {
	const { t } = useTranslation();

	return (
		<Card className="bg-card/70">
			<CardHeader>
				<CardTitle>{t("home.pattern.title")}</CardTitle>
				<CardDescription>{t("home.pattern.description")}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4 text-muted-foreground">
				<p>
					<Trans
						components={{
							providersPath: <code />,
							routesPath: <code />,
							storePath: <code />,
						}}
						i18nKey="home.pattern.firstParagraph"
					/>
				</p>
				<p>
					<Trans
						components={{
							apiPath: <code />,
						}}
						i18nKey="home.pattern.secondParagraph"
					/>
				</p>
			</CardContent>
		</Card>
	);
}
