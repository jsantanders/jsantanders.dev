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
			classes = "ordered";
			break;
		case "ul":
			classes = "unordered";
			break;
		default:
			classes = "";
			break;
	}

	return <Component className={`${classes} my-5`} {...props} />;
};
