import { Layout } from "@/components/layout";
import { locales } from "@/config";
import { unstable_setRequestLocale } from "next-intl/server";
import { Work_Sans, Space_Mono } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "./providers";
import { Metadata } from "next";

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

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
};
