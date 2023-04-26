import { useI18n } from "next-localization";

import Link from "@/icons/link.svg";

export type HeadingProps = React.PropsWithChildren<{
  level: string;
}>;

/**
 * Generate an id for a heading.
 * @param {string} str the heading text
 * @returns {string} the id
 */
const createId = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
};

/**
 * This component renders a header with an anchor link.
 * @param {HeadingProps} props component props
 * @returns {React.ReactElement} React component
 */
export const Heading: React.FC<HeadingProps> = ({ level, children, ...props }) => {
  const i18n = useI18n();
  const id = createId(children as string);

  let size;
  let translate;
  const Component = level as React.ElementType;

  switch (level) {
    case "h1":
      size = "text-5xl";
      translate = "-translate-y-0.5 md:translate-y-h1";
      break;
    case "h2":
      size = "text-4xl";
      translate = "md:translate-y-h2";
      break;
    case "h3":
      size = "text-3xl";
      translate = "translate-y-0.5 md:translate-y-h3";
      break;
    case "h4":
      size = "text-2xl";
      translate = "translate-y-1 md:translate-y-h4";
      break;
    case "h5":
      size = "text-xl";
      translate = "translate-y-1 md:translate-y-h5";
      break;
    case "h6":
      size = "text-lg";
      translate = "translate-y-1.5 md:translate-y-h6";
      break;
    default:
      break;
  }

  return (
    <Component className={`group relative break-words ${size} mb-6 mt-8 font-bold`} {...props}>
      {children}
      <a
        id={id}
        href={`#${id}`}
        style={{ scrollMarginTop: "142px" }}
        className={`align-text-middle inline-block transform md:absolute md:left-0 md:-translate-x-8 ${translate} ml-2 rounded opacity-0 hover:opacity-70 focus:opacity-70 focus:outline-none focus:ring-2 group-hover:opacity-70 group-focus:opacity-70 md:ml-0`}
      >
        <Link width={24} />
        <span className="sr-only">{i18n.t("blog.anchor")}</span>
      </a>
    </Component>
  );
};
