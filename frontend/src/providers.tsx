import { timeConversion } from "@hyoretsu/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BaseProvider, DarkTheme } from "baseui";
import type { ReactNode } from "react";

export const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onSuccess: (_data, _variables, _onMutateResult, context) => {
				context.client.invalidateQueries({ queryKey: context?.mutationKey });
			},
		},
		queries: {
			retry: 5,
			staleTime: timeConversion(1, "minutes", "milliseconds"),
		},
	},
});

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<BaseProvider theme={DarkTheme}>{children}</BaseProvider>
		</QueryClientProvider>
	);
}
