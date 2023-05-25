import { Fragment, PropsWithChildren, useEffect } from "react";

import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Popover, Transition } from "@headlessui/react";
import { useI18n } from "next-localization";

import useHiddenNav from "@/hooks/use-hidden-nav";
import Caret from "@/icons/caret.svg";
import Close from "@/icons/close.svg";
import { LangButton } from "@/ui/LangButton";

const ThemeButton = dynamic(() => import("@/components/ThemeButton"), {
  ssr: false,
});

type NavLinkProps = {
  href: string;
};

/**
 * Renders a navigation link for desktop
 * @param {NavLinkProps} props The component props
 * @returns {React.ReactElement} The component
 */
const DesktopNavLink: React.FC<React.PropsWithChildren<NavLinkProps>> = ({ children, href }) => {
  const router = useRouter();
  const isActive = router.pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  return (
    <NextLink href={href}>
      <span
        className={`${
          isActive ? "text-primary" : "text-secondary"
        } mr-2 rounded-lg px-2 py-2 text-lg font-semibold hover:bg-secondary hover:text-primary focus:outline-none focus-visible:bg-secondary focus-visible:text-primary focus-visible:ring-2 active:bg-tertiary md:mr-4 md:px-4`}
      >
        {children}
      </span>
    </NextLink>
  );
};

/**
 * Renders a navigation bar for desktop devices
 * @param {{ className: string }} props - The component props
 * @returns {ReactElement} The navigation bar
 */
const DesktopNav: React.FC<{ className: string }> = ({ className }) => {
  const i18n = useI18n();

  return (
    <div className={className}>
      <DesktopNavLink href="/">{i18n.t("nav.home")}</DesktopNavLink>
      <DesktopNavLink href="/blog">{i18n.t("nav.blog")}</DesktopNavLink>
      <DesktopNavLink href="/about">{i18n.t("nav.about")}</DesktopNavLink>
    </div>
  );
};

/**
 * @component MobileNavItem - The mobile nav item
 * @param {PropsWithChildren<{ href: string }>} props - The component props
 * @returns {ReactElement} The mobile nav item.
 */
const MobileNavLink: React.FC<PropsWithChildren<{ href: string }>> = ({ href, children }) => {
  return (
    <li>
      <Popover.Button as={NextLink} href={href} className="block py-2">
        {children}
      </Popover.Button>
    </li>
  );
};

/**
 * Renders a navigation bar for mobile devices
 * @param {{ className: string }} props - The component props
 * @returns {ReactElement} The mobile navigation.
 */
const MobileNav: React.FC<{ className: string }> = ({ className }) => {
  const i18n = useI18n();

  return (
    <Popover className={className}>
      <Popover.Button className="group flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium ring-1 ring-primary backdrop-blur">
        {i18n.t("nav.menu")}
        <Caret className="ml-3 h-auto w-4 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-primary p-8 ring-1 ring-primary"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                <Close className="h-6 w-6 text-primary" />
              </Popover.Button>
              <h2 className="text-sm font-medium text-primary">Navigation</h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-primary text-base text-primary">
                <MobileNavLink href="/">{i18n.t("nav.home")}</MobileNavLink>
                <MobileNavLink href="/blog">{i18n.t("nav.blog")}</MobileNavLink>
                <MobileNavLink href="/about">{i18n.t("nav.about")}</MobileNavLink>
              </ul>
            </nav>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
};

/**
 * Renders the navigation bar
 * @param {NavProps} props The component props
 * @returns {React.ReactElement} The component
 */
export const Nav: React.FC = () => {
  const [navRef, isNavVisible] = useHiddenNav();
  const classes = isNavVisible ? "navbar" : "navbar navbar-hidden";

  // hack to close the menu on scroll
  useEffect(() => {
    const btn = document.querySelector("[data-reach-menu-button='']");
    if (!isNavVisible && btn?.getAttribute("aria-expanded")) {
      const clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent("mousedown", true, true);
      btn?.dispatchEvent(clickEvent);
    }
  }, [isNavVisible]);

  return (
    <nav ref={navRef} className={`sticky top-0 z-10 bg-primary ${classes}`}>
      <div className="mx-auto my-0 flex w-full items-center justify-between p-4 md:my-4">
        <Fragment>
          <MobileNav className="pointer-events-auto md:hidden" />
          <DesktopNav className="pointer-events-auto hidden md:block" />
        </Fragment>
        <div className="flex flex-row">
          <ThemeButton />
          <LangButton />
        </div>
      </div>
    </nav>
  );
};
