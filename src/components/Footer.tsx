import NextLink from "next/link";

import { useI18n } from "next-localization";

type FooterLinkProps = {
  href: string;
  external?: boolean;
};

/**
 * Render a link in the footer
 * @param {FooterLinkProps} props The component props
 * @returns {React.ReactElement} The component
 */
const FooterLink: React.FC<React.PropsWithChildren<FooterLinkProps>> = ({
  children,
  href,
  external,
}) => {
  if (external) {
    return (
      <a
        className="rounded p-1 text-gray-600 underline focus:outline-none focus:ring-2 dark:text-gray-400"
        target="_blank"
        rel="noopener noreferrer"
        href={href}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href}>
      <span className="rounded p-1 text-gray-600 underline focus:outline-none focus:ring-2 dark:text-gray-400">
        {children}
      </span>
    </NextLink>
  );
};

/**
 * Renders the footer
 * @returns {React.ReactElement} The component
 */
export const Footer: React.FC = () => {
  const i18n = useI18n();

  return (
    <footer className="mx-auto mt-16 w-full px-4 pb-5 md:px-0">
      <hr className="border-1 mb-7 w-full border-primary dark:border-primary" />
      <ul className="items-center gap-6 text-sm sm:flex sm:justify-center md:flex md:justify-between">
        <li className="hidden md:flex">
          <FooterLink href={i18n.t("footer.rss.href")}>{i18n.t("footer.rss.name")}</FooterLink>
        </li>
        <li>
          &copy; {new Date().getFullYear()} {i18n.t("footer.license")}
          <FooterLink href="https://creativecommons.org/licenses/by/4.0/" external>
            {i18n.t("footer.copyright")}
          </FooterLink>
        </li>
      </ul>
    </footer>
  );
};
