import { forwardRef, PropsWithChildren } from "react";

type CodeProps = {
  className: string;
};

export const Code: React.FC<CodeProps> = ({ className, ...props }: CodeProps) => {
  return (
    <code
      className={
        className
          ? `${className} max-h-3/4 block px-2 py-6 md:px-4 md:py-8`
          : "rounded bg-muted px-1.5 py-1 text-sm"
      }
      {...props}
    />
  );
};
