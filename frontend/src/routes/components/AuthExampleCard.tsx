import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiArrowRightOnRectangle, HiCheckCircle, HiLockClosed } from "react-icons/hi2";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores";

export function AuthExampleCard() {
	const { t } = useTranslation();
	const { clearError, error, isAuthenticated, isLoading, logout, signIn, user } = useAuthStore();
	const [email, setEmail] = useState("demo@example.com");
	const [password, setPassword] = useState("password");

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await signIn({
			defaultUserName: t("auth.defaultUserName"),
			email,
			invalidCredentialsMessage: t("auth.errors.invalidCredentials"),
			password,
		});
	};

	return (
		<Card>
			<CardHeader className="flex-row items-start gap-3">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
					<HiLockClosed className="h-5 w-5" />
				</div>
				<div className="space-y-1">
					<CardTitle>{t("home.auth.title")}</CardTitle>
					<CardDescription>{t("home.auth.description")}</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				{isAuthenticated && user ? (
					<div className="space-y-5">
						<div className="rounded-md border border-primary/30 bg-primary/10 p-4">
							<div className="flex items-center gap-2 font-medium text-primary">
								<HiCheckCircle className="h-5 w-5" />
								{t("home.auth.signedInAs", { name: user.name })}
							</div>
							<p className="mt-1 text-muted-foreground text-sm">{user.email}</p>
						</div>
						<Button onClick={logout} type="button" variant="outline">
							{t("home.auth.signOut")}
						</Button>
					</div>
				) : (
					<form className="space-y-4" onSubmit={handleSubmit}>
						<Label>
							{t("home.auth.emailLabel")}
							<Input
								onChange={event => {
									setEmail(event.target.value);
									clearError();
								}}
								type="email"
								value={email}
							/>
						</Label>
						<Label>
							{t("home.auth.passwordLabel")}
							<Input
								onChange={event => {
									setPassword(event.target.value);
									clearError();
								}}
								type="password"
								value={password}
							/>
						</Label>
						{error && <Alert className="text-destructive">{error}</Alert>}
						<Button disabled={isLoading} type="submit">
							{isLoading ? t("home.auth.signingIn") : t("home.auth.signIn")}
							<HiArrowRightOnRectangle className="h-5 w-5" />
						</Button>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
