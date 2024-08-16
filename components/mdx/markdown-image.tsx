import Image from "next/image";

type Props = {
	src?: string;
	alt?: string;
	width?: number | string;
	height?: number | string;
	blurDataURL?: string;
};

export const MarkdownImage: React.FC = ({
	src,
	alt,
	width,
	height,
	blurDataURL,
}: Props) => {
	if (!src || !alt) {
		throw new Error("src and alt is required");
	}

	return (
		<Image
			blurDataURL={blurDataURL}
			placeholder={blurDataURL ? "blur" : "empty"}
			src={src}
			alt={alt}
			width={Number(width)}
			height={Number(height)}
			className="rounded-lg border border-muted"
		/>
	);
};
