import { Fragment, type PropsWithChildren } from "react";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { useTranslations } from "next-intl";

export const Layout = ({ children }: PropsWithChildren) => {
  const t = useTranslations("nav");
  const locales = {
    home: t("home"),
    blog: t("blog"),
    about: t("about"),
    navigation: t("navigation"),
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative mx-auto w-full max-w-2xl px-8">
        <Navbar locales={locales} />
        <main className="flex flex-col max-w-full items-center justify-center py-16">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
