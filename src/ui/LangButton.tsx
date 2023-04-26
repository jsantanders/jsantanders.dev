import NextLink from "next/link";
import { useRouter } from "next/router";

import { useI18n } from "next-localization";

/**
 * Dropdown button to change language.
 * This currently only supports English and Spanish.
 * @param {FlagButtonProps} props component props
 * @returns {React.ReactElement} React component.
 */
export const LangButton: React.FC = () => {
  const router = useRouter();
  const i18n = useI18n();

  const isES = router?.locale === "es";
  const to = isES ? router.asPath : `/es${router.asPath}`;
  const language = isES ? "en" : "en";

  return (
    <NextLink
      href={to}
      locale={language}
      aria-label={i18n.t("nav.language")}
      title={i18n.t("nav.language")}
      className="flex flex-row items-center justify-center rounded-xl px-2 py-2 hover:bg-secondary focus:outline-none focus-visible:bg-secondary focus-visible:ring-2 active:bg-tertiary"
    >
      <span>{isES ? <span>Español</span> : <span>English</span>}</span>
    </NextLink>
  );
};
