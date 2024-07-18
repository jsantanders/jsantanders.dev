import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import NextLink from "next/link";

type FooterLinkProps = {
  href: string;
  external?: boolean;
};

export const Footer: React.FC = () => {
  const t = useTranslations("footer");

  return (
    <footer className="mb-8 text-muted-foreground">
      <Separator className="my-2" decorative />
      <span className="text-sm">
        &copy; {new Date().getFullYear()} {t("license")}{" "}
        <FooterLink href="https://creativecommons.org/licenses/by/4.0/" external>
          {t("copyright")}
        </FooterLink>
      </span>
    </footer>
  );
};

const FooterLink: React.FC<React.PropsWithChildren<FooterLinkProps>> = ({
  children,
  href,
  external,
}) => {
  if (external) {
    return (
      <a
        className="text-muted-foreground underline focus:outline-none focus:ring-2"
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
      <span className="text-muted-foreground underline focus:outline-none focus:ring-2">
        {children}
      </span>
    </NextLink>
  );
};
