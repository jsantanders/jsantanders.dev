import { forwardRef } from "react";

type CodeProps = {
  className: string;
};

export const Code = forwardRef<HTMLElement, CodeProps>(({ className, ...props }, ref) => {
  return (
    <code
      ref={ref}
      className={
        className
          ? `${className} block max-h-3/4 overflow-auto px-2 py-6 md:px-4 md:py-8`
          : "rounded bg-gray-200 px-1.5 py-1 dark:bg-gray-700"
      }
      {...props}
    />
  );
});

Code.displayName = "Code";
