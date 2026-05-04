import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthUser {
	email: string;
	id: string;
	name: string;
}

export interface AuthState {
	clearError: () => void;
	error: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	logout: () => void;
	signIn: (credentials: {
		defaultUserName: string;
		email: string;
		invalidCredentialsMessage: string;
		password: string;
	}) => Promise<boolean>;
	user: AuthUser | null;
}

export const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			clearError: () => set({ error: null }),
			error: null,
			isAuthenticated: false,
			isLoading: false,
			logout: () => {
				set({
					error: null,
					isAuthenticated: false,
					user: null,
				});
			},
			signIn: async ({ defaultUserName, email, invalidCredentialsMessage, password }) => {
				set({ error: null, isLoading: true });

				await new Promise(resolve => window.setTimeout(resolve, 350));

				if (!email || password.length < 6) {
					set({
						error: invalidCredentialsMessage,
						isLoading: false,
					});
					return false;
				}

				set({
					error: null,
					isAuthenticated: true,
					isLoading: false,
					user: {
						email,
						id: crypto.randomUUID(),
						name: email.split("@")[0] || defaultUserName,
					},
				});
				return true;
			},
			user: null,
		}),
		{
			name: "template-auth",
			partialize: state => ({
				isAuthenticated: state.isAuthenticated,
				user: state.user,
			}),
			storage: createJSONStorage(() => localStorage),
		},
	),
);
