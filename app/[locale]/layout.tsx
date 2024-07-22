import { Layout } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";
import { locales } from "@/config";
import type { Metadata, Viewport } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { Work_Sans } from "next/font/google";
import "../styles/globals.css";
import Providers from "./providers";

const workSans = Work_Sans({
	subsets: ["latin"],
	display: "swap",
});

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	return (
		<html
			suppressHydrationWarning
			lang={locale}
			className={`${workSans.className} antialiased`}
		>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Providers>
						<Layout>{children}</Layout>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};
