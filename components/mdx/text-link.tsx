import { Link } from "@/navigation";

type TextLinkProps = {
  href: string;
};

export const TextLink: React.FC<React.PropsWithChildren<TextLinkProps>> = ({
  href,
  children,
  ...props
}) => {
  const classes = "rounded underline focus:outline-none focus:ring-2";

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
      <Link href={href}>
        <span className={classes} {...props}>
          {children}
        </span>
      </Link>
    );
  }
};
