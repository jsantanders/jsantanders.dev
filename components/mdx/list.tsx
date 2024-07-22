import type { PropsWithChildren } from "react";

export type ListProps = {
	type: "ol" | "ul";
};

export const List: React.FC<PropsWithChildren<ListProps>> = ({
	type,
	...props
}) => {
	let classes: string;
	const Component = type as React.ElementType;

	switch (type) {
		case "ol":
			classes = "ordered list-decimal list-inside";
			break;
		case "ul":
			classes = "unordered list-disc list-inside";
			break;
		default:
			classes = "";
			break;
	}

	return (
		<Component
			className={`${classes} space-y-1 text-base leading-relaxed lg:text-lg`}
			{...props}
		/>
	);
};
