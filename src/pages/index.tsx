import type { GetStaticProps } from "next";
import { useI18n } from "next-localization";

import { Container } from "@/components/Container";
import { Graph } from "@/components/Graph";
import { Repos } from "@/components/Repos";
import { SocialLink } from "@/components/SocialLink";
import github from "@/icons/github.svg";
import linkedin from "@/icons/linkedin.svg";
import twitter from "@/icons/twitter.svg";

/**
 * Renders the home page
 * @returns {React.ReactElement} React component
 */
const Home: React.FC = () => {
  const i18n = useI18n();

  return (
    <Container seo={i18n.t("home.seo") as unknown as { [key: string]: string }}>
      <h1 className="my-8 text-center text-4xl font-bold sm:text-5xl">{i18n.t("home.welcome")}</h1>
      <ul className="mb-6 mt-6 flex gap-6">
        <SocialLink
          href={"https://twitter.com/jsantanders"}
          ariaLabel={i18n.t("home.social.twitter")}
          icon={twitter}
        />
        <SocialLink
          href={"https://github.com/jsantanders"}
          ariaLabel={i18n.t("home.social.github")}
          icon={github}
        />
        <SocialLink
          href={"https://linkedin.com/in/jsantanders"}
          ariaLabel={i18n.t("home.social.linkedin")}
          icon={linkedin}
        />
      </ul>
      <div className="relative my-8 flex w-full justify-center p-3 md:w-min">
        <div className="rounded-lg bg-primary px-4 py-8" style={{ width: "700px" }}>
          <p className="mb-4">{i18n.t("home.about.1")}</p>
          <p className="mb-4">{i18n.t("home.about.2")}</p>
          <p>{i18n.t("home.about.3")}</p>
        </div>
        <div className="absolute top-0 -z-10 h-full w-full -rotate-1.5 transform rounded-lg bg-orange" />
        <div className="absolute top-0 -z-20 h-full w-full rotate-1 transform rounded-lg bg-orange opacity-20" />
      </div>
      <h2 className="my-16 text-2xl font-medium">{i18n.t("home.community")}</h2>
      <Repos />
      <Graph />
    </Container>
  );
};

/** Next.js function to get the static props
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

export default Home;
