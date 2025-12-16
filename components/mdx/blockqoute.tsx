export const Blockquote: React.FC<React.HTMLAttributes<HTMLQuoteElement>> = (
	props,
) => {
	return (
		<blockquote className="my-8 border-l-4 border-gray-300 pl-4" {...props} />
	);
};
