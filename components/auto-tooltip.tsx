"use client";

import { cn } from "@/lib/utils";
import type { FC, HTMLAttributes } from "react";

export const AutoTooltip: FC<HTMLAttributes<HTMLSpanElement>> = ({
	className,
	children,
}) => {
	return (
		<div
			className={cn(className)}
			onMouseEnter={({ currentTarget }) => {
				if (currentTarget.scrollHeight > currentTarget.clientHeight) {
					currentTarget.title = currentTarget.innerText;
				}
			}}
		>
			{children}
		</div>
	);
};
