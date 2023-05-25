import Image from "next/image";
import NextLink from "next/link";

import type { GetStaticProps } from "next";
import { useI18n } from "next-localization";

import { Container } from "@/components/Container";
import { SocialLink } from "@/components/SocialLink";
import github from "@/icons/github.svg";
import linkedin from "@/icons/linkedin.svg";
import twitter from "@/icons/twitter.svg";
import AzDevCert from "@/images/certifications/microsoft-certified-azure-developer-associate.png";
import portraitImage from "@/images/portrait.jpg";

/**
 * Renders the about page
 * @returns {React.ReactElement} React component
 */
const Blog: React.FC = () => {
  const i18n = useI18n();

  return (
    <Container seo={i18n.t("about.seo") as unknown as { [key: string]: string }}>
      <div className="my-8 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-5xl">
            {i18n.t("about.title")}
          </h1>
          <div className="mt-6 space-y-7 text-base text-primary">
            <p>{i18n.t("about.1")}</p>
            <p>{i18n.t("about.2")}</p>
            <p>{i18n.t("about.3")}</p>
          </div>
          <div className="mt-6 space-y-7">
            <NextLink
              href="https://www.credly.com/badges/f1806c26-da8b-4393-81ea-9335465876e0"
              target="_blank"
            >
              <Image src={AzDevCert} alt="" width={128} />
            </NextLink>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul>
            <SocialLink
              href={"https://twitter.com/jsantanders"}
              icon={twitter}
              ariaLabel={i18n.t("home.social.twitter")}
            >
              {i18n.t("home.social.twitter")}
            </SocialLink>
            <SocialLink
              href={"https://github.com/jsantanders"}
              icon={github}
              className="mt-4"
              ariaLabel={i18n.t("home.social.github")}
            >
              {i18n.t("home.social.twitter")}
            </SocialLink>
            <SocialLink
              href={"https://linkedin.com/in/jsantanders"}
              icon={linkedin}
              className="mt-4"
              ariaLabel={i18n.t("home.social.linkedin")}
            >
              {i18n.t("home.social.linkedin")}
            </SocialLink>
          </ul>
        </div>
      </div>
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

export default Blog;
