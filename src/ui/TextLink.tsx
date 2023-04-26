import NextLink from "next/link";

type TextLinkProps = {
  href: string;
};

/**
 * Render a link with a hover effect.
 * @param {TextLinkProps} props component props
 * @returns {React.ReactElement} React component
 */
export const TextLink: React.FC<React.PropsWithChildren<TextLinkProps>> = ({
  href,
  children,
  ...props
}) => {
  const classes = "text-blue-400 rounded hover:underline focus:outline-none focus:ring-2";

  if (href?.match(/^#/)) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  } else if (href?.match(/(^http)/i)) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  } else {
    return (
      <NextLink href={href}>
        <span className={classes} {...props}>
          {children}
        </span>
      </NextLink>
    );
  }
};
