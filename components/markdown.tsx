"use client";

import {
	Callout,
	Code,
	ConsCard,
	Division,
	Heading,
	List,
	ListItem,
	Mafs,
	MarkdownImage,
	Paragraph,
	Preformatted,
	ProsCard,
	TextLink,
	Tweet,
} from "@/components/mdx";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { usePostView } from "./post/use-post-view";

type Props = {
	code: string;
	slug: string;
	markdownLocales: {
		codeLocales: {
			copy: string;
			copied: string;
			error: string;
		};
	};
};

export const Markdown = ({ code, markdownLocales, slug }: Props) => {
	const MDXComponents = {
		h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
			<Heading level="h1" {...props} />
		),
		h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
			<Heading level="h2" {...props} />
		),
		h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
			<Heading level="h3" {...props} />
		),
		h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
			<Heading level="h4" {...props} />
		),
		h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
			<Heading level="h5" {...props} />
		),
		h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
			<Heading level="h6" {...props} />
		),
		p: Paragraph,
		ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
			<List type="ul" {...props} />
		),
		ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
			<List type="ol" {...props} />
		),
		li: (props: React.HTMLAttributes<HTMLLIElement>) => <ListItem {...props} />,
		img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
			<MarkdownImage {...props} />
		),
		a: TextLink as React.FC,
		code: Code as unknown as React.FC,
		pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
			<Preformatted {...props} locales={markdownLocales.codeLocales} />
		),
		div: Division as React.FC,
		Tweet: (props: React.ComponentProps<typeof Tweet>) => <Tweet {...props} />,
		Callout,
		ProsCard,
		ConsCard,
		Mafs,
	};

	usePostView(slug);
	const Component = useMemo(() => getMDXComponent(code), [code]);
	return <Component components={MDXComponents} />;
};
