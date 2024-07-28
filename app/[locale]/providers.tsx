"use client";

import { AnalyticsProvider } from "@/components/analytics-context";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { getQueryClient } from "@/query-client";
import {
	QueryClient,
	QueryClientProvider,
	isServer,
} from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
	const queryClient = getQueryClient();

	return (
		<AnalyticsProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
			<SpeedInsights />
			<Analytics />
		</AnalyticsProvider>
	);
}
