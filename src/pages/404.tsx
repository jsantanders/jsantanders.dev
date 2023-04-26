import NextLink from "next/link";

import type { GetStaticProps } from "next";
import { useI18n } from "next-localization";

import { Container } from "@/components/Container";
import Arrow from "@/icons/arrow.svg";

/**
 * Renders the 404 page
 * @returns {React.ReactElement} React component
 **/
const Custom404: React.FC = () => {
  const i18n = useI18n();

  return (
    <Container seo={i18n.t("404.seo") as unknown as { [key: string]: string }}>
      <div className="max-w-2xl">
        <h1 className="my-8 text-3xl font-bold sm:text-5xl">{i18n.t("404.title")}</h1>
        <p className="mb-8">{i18n.t("404.subtitle")}</p>
        <NextLink href="/">
          <span className="m-auto inline-flex rounded-md border border-solid border-gray-200 p-4 text-gray-400 dark:border-gray-800">
            <span className="mr-1" aria-hidden>
              <Arrow width={16} />
            </span>
            {i18n.t("404.button")}
          </span>
        </NextLink>
      </div>
    </Container>
  );
};

/**
 * Next.js function to get the static props
 * @param {GetStaticPropsContext} context - Context
 * @returns {Promise<GetStaticPropsResult<StaticProps>>} Promise of static props
 **/
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const language = await import(`../locales/${locale}.json`);

  return {
    props: {
      lngDict: language.default,
    },
  };
};

export default Custom404;
