import { cloneElement, useEffect, useRef, useState } from "react";

import { useI18n } from "next-localization";

import CopyIcon from "@/icons/copy.svg";
import CopyErrorIcon from "@/icons/copy-error.svg";
import CopySuccessIcon from "@/icons/copy-success.svg";

type PreformattedProps = React.PropsWithChildren<{
  className: string;
}>;

/**
 * Renders a preformatted block with a copy button.
 * @param {PreformattedProps} props component props
 * @returns {React.ReactElement} React component
 */
export const Preformatted: React.FC<PreformattedProps> = ({ className, children, ...props }) => {
  const [, lang] = className.match(/language-(.+)/) as RegExpMatchArray;
  const [copy, setCopy] = useState<string>("copy");
  const childrenRef = useRef<HTMLElement>();
  const i18n = useI18n();

  /**
   * Copies the content of the preformatted block to the clipboard.
   * @returns {Promise<void>} void
   */
  const copyToClipboard = async () => {
    if (navigator.clipboard && childrenRef?.current?.textContent) {
      return navigator.clipboard.writeText(childrenRef.current.textContent).then(
        () => setCopy("copy-success"),
        () => setCopy("copy-error")
      );
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copy !== "copy") {
      timer = setTimeout(() => {
        setCopy("copy");
      }, 2000);
    }
    return () => timer && clearTimeout(timer);
  }, [copy]);

  let color;

  switch (copy) {
    case "copy-success":
      color = "text-green-500";
      break;
    case "copy-error":
      color = "text-red-500";
      break;
    default:
      color = "text-gray-500";
      break;
  }

  return (
    <pre
      data-language={lang === "unknown" ? undefined : lang}
      className={`${className} group relative my-5 overflow-hidden rounded border border-primary bg-secondary`}
      {...props}
    >
      <button
        onClick={copyToClipboard}
        className={`absolute bottom-1 right-3 inline-flex text-xs md:bottom-2 md:right-4 ${color} rounded p-0.5 font-medium uppercase opacity-0 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-focus:opacity-100`}
        type="button"
        aria-label={i18n.t(`blog.${copy}`)}
        title={i18n.t(`blog.${copy}`)}
      >
        <span className="mr-1">{i18n.t(`blog.${copy}`)}</span>
        {copy === "copy" && <CopyIcon width={16} height={16} aria-hidden />}
        {copy === "copy-success" && <CopySuccessIcon width={16} height={16} aria-hidden />}
        {copy === "copy-error" && <CopyErrorIcon width={16} height={16} aria-hidden />}
      </button>
      {cloneElement(children as React.ReactElement, { ref: childrenRef })}
    </pre>
  );
};
