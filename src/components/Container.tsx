import { forwardRef, PropsWithChildren } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import clsx from "clsx";
import { useI18n } from "next-localization";

import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { SkipNavContent, SkipNavLink } from "@/ui/SkipNav";

type ContainerProps = React.PropsWithChildren<{
  seo?: { [key: string]: string | string[] };
  className?: string;
}>;

const OuterContainer = forwardRef<HTMLDivElement, PropsWithChildren<ContainerProps>>(
  function OuterContainer(props, ref) {
    const { className, children, ...rest } = props;
    return (
      <div ref={ref} className={clsx(className)} {...rest}>
        <div className="mx-auto max-w-7xl lg:px-8">{children}</div>
      </div>
    );
  }
);

const InnerContainer = forwardRef<HTMLDivElement, PropsWithChildren<ContainerProps>>(
  function InnerContainer(props, ref) {
    const { className, children, ...rest } = props;
    return (
      <div ref={ref} className={clsx("border-bg-red relative lg:px-12", className)} {...rest}>
        <div className="mx-auto max-w-2xl lg:max-w-6xl">{children}</div>
      </div>
    );
  }
);

/**
 * The main container for the website
 * @param {ContainerProps} props The component props
 * @returns {React.ReactElement} The component
 */
export const Container: React.FC<ContainerProps> = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ContainerProps>
>(({ children, seo = {} }, ref) => {
  const router = useRouter();
  const i18n = useI18n();

  const meta: { [key: string]: string } = {
    type: "website",
    image: i18n.t("seo.image.url"),
    imageAlt: i18n.t("seo.image.alt"),
    ...seo,
  };

  const isEN = router?.locale === "en";
  const isArticle = meta.type === "article";
  const path = isEN ? router.asPath : `/es${router.asPath}`;

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta property="og:site_name" content="Jesus Santander" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:image:url" content={meta.image} />
        <meta property="og:image:secure_url" content={meta.image} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content={meta.imageAlt} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />
        <meta property="og:url" content={`https://jsantanders.dev${path}`} />
        <meta property="og:locale" content={isEN ? "en" : "es"} />
        <meta property="og:locale:alternate" content={isEN ? "es" : "en"} />
        {isArticle && meta.publishedAt && (
          <>
            <meta
              property="article:published_time"
              content={new Date(meta.publishedAt).toISOString()}
            />
            {meta.modifiedAt && (
              <meta
                property="article:modified_time"
                content={new Date(meta.modifiedAt).toISOString()}
              />
            )}
            <meta property="article:author" content="Jesus Santander" />
            {(meta.tags as unknown as string[]).map((tag) => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@jsantanders" />
        <meta name="twitter:creator" content="@jsantanders" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        <meta name="twitter:image:alt" content={meta.imageAlt} />
        <link rel="canonical" href={`https://jsantanders.dev${path}`} />
        <link
          rel="alternate"
          type="application/atom+xml"
          href={`/${isEN ? "en" : "es"}.feed.xml`}
          title={i18n.t(`seo.rss.${isEN ? "en" : "es"}`)}
        />
        <link rel="manifest" href={`/favicons/${isEN ? "en" : "es"}.site.webmanifest`} />
      </Head>

      <OuterContainer ref={ref}>
        <InnerContainer>
          <SkipNavContent />
          <SkipNavLink>{i18n.t("a11y.skipContent")}</SkipNavLink>
          <Nav />
          <main className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
            {children}
          </main>
          <Footer />
        </InnerContainer>
      </OuterContainer>
    </>
  );
});

Container.displayName = "Container";
