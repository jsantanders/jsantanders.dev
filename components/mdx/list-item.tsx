"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ListItemProps = React.PropsWithChildren<
	React.HTMLAttributes<HTMLLIElement>
>;

export const ListItem: React.FC<ListItemProps> = ({ children, ...props }) => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const listRef = useRef<any>();
	const { className, ...rest } = props;
	const [type, setType] = useState<string>("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setType(listRef?.current?.parentElement.nodeName.toLowerCase());
	}, [listRef]);

	return (
		<li ref={listRef} className="flex flex-row items-baseline" {...rest}>
			{type === "ul" && (
				<span
					className="min-w-20 translate-y-1 transform text-secondary pr-3"
					aria-hidden
				>
					<ArrowRight width={18} height={18} />
				</span>
			)}
			{children}
		</li>
	);
};
