export const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (
	props,
) => {
	return (
		<p className="my-5 text-prose leading-relaxed lg:text-lg" {...props} />
	);
};
