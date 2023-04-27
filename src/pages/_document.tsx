/* eslint-disable require-jsdoc */
import type { DocumentContext, DocumentInitialProps, DocumentProps } from "next/document";
import Document, { Head, Html, Main, NextScript } from "next/document";

import { createCSP } from "@/utils/csp";
import { generateRandomString } from "@/utils/random";

type CustomProps = {
  nonce: string;
};

/**
 * Main document component
 * @param {DocumentProps} props - Document props
 * @returns {React.ReactElement} React component
 **/
class MyDocument extends Document<DocumentProps & CustomProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & CustomProps> {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = Buffer.from(generateRandomString(16)).toString("base64");

    return { ...initialProps, nonce };
  }

  render(): JSX.Element {
    const { nonce } = this.props;

    return (
      <Html dir="ltr" className="h-full antialiased">
        <Head nonce={nonce}>
          <link
            rel="preload"
            href="/fonts/work-sans.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link rel="shortcut icon" href="/favicons/favicon.ico" />
          <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16" />
          <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" sizes="180x180" />
          <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#14191e" />
          <meta name="theme-color" content="#14191e" />
          <meta name="color-scheme" content="dark light" />
          <meta httpEquiv="Content-Security-Policy" content={createCSP(nonce)} />
        </Head>
        <body>
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html:
                "function getThemePreference(){return localStorage.getItem('theme')?localStorage.getItem('theme'):window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.body.classList.add(getThemePreference());",
            }}
          />
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
