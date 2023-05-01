import { useEffect, useRef } from "react";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { Analytics } from "@vercel/analytics/react";
import { I18nProvider } from "next-localization";

import { AnalyticsProvider } from "@/components/AnalyticsContext";

import "focus-visible";

import "@/styles/index.css";

/**
 * Hook to ref a value and return it
 * @param {string} value the string value
 * @returns {string | undefined} the value
 */
const usePrevious = (value: string) => {
  const ref = useRef<string>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * Main app component
 * @param {AppProps} props - App props
 * @returns {React.ReactElement} React component
 */
const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const { lngDict, ...rest } = pageProps;
  const router = useRouter();
  const previousPathname = usePrevious(router.pathname);

  return (
    <I18nProvider lngDict={lngDict} locale={router?.locale as string}>
      <AnalyticsProvider>
        <Component previousPathname={previousPathname} {...rest} />
        <Analytics />
      </AnalyticsProvider>
    </I18nProvider>
  );
};

export default App;
