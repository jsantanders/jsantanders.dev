import { JetBrains_Mono } from "next/font/google";
import { forwardRef } from "react";

const jetbrains = JetBrains_Mono({
	weight: "400",
	subsets: ["latin"],
});

type CodeProps = {
	className: string;
};

export const Code = forwardRef<HTMLElement, CodeProps>(
	({ className, ...props }, ref) => {
		return (
			<code
				ref={ref}
				className={
					className
						? `${className} max-h-3/4 block px-2 py-6 md:px-4 md:py-8`
						: `${jetbrains.className} rounded bg-muted border border-muted-foreground px-1.5 py-1 text-sm`
				}
				{...props}
			/>
		);
	},
);
