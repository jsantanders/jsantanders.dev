import NextLink from "next/link";

import clsx from "clsx";

/**
 * @component SocialLink - The social link component
 * @param {Object} props - component props
 * @returns {ReactElement} The component
 */
export const SocialLink = (
  props: React.PropsWithChildren<{
    icon: React.FC<React.HTMLAttributes<SVGElement>>;
    href: string;
    ariaLabel: string;
    className?: string;
    linkProps?: React.HTMLAttributes<HTMLAnchorElement>;
  }>
) => {
  const { className, href, icon: Icon, children, linkProps, ariaLabel } = props;
  return (
    <li className={clsx(className, "flex")}>
      <NextLink
        target="_blank"
        href={href}
        aria-label={ariaLabel}
        title={ariaLabel}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-gray-500 dark:text-zinc-200 dark:hover:text-gray-500"
        {...linkProps}
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-gray-400" />
        <span className="ml-4">{children}</span>
      </NextLink>
    </li>
  );
};
