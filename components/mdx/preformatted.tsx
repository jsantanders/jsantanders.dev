"use client";

import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { JetBrains_Mono } from "next/font/google";
import { cloneElement, useEffect, useRef, useState } from "react";

type PreformattedProps = React.PropsWithChildren<{
	className?: string;
	locales: {
		copy: string;
		copied: string;
		error: string;
	};
}>;

const space = JetBrains_Mono({
	weight: "400",
	subsets: ["latin"],
	variable: "--space-mono",
});

export const Preformatted: React.FC<PreformattedProps> = ({
	className,
	children,
	locales,
	...props
}) => {
	const [, lang] = className?.match(/language-(.+)/) as RegExpMatchArray;
	const [copy, setCopy] = useState<string>("copy");
	const childrenRef = useRef<HTMLElement>();

	const copyToClipboard = async () => {
		if (navigator.clipboard && childrenRef?.current?.textContent) {
			return navigator.clipboard
				.writeText(childrenRef.current.textContent)
				.then(
					() => setCopy("copy-success"),
					() => setCopy("copy-error"),
				);
		}
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (copy !== "copy") {
			timer = setTimeout(() => {
				setCopy("copy");
			}, 2000);
		}
		return () => timer && clearTimeout(timer);
	}, [copy]);

	let color: string;

	switch (copy) {
		case "copy-success":
			color = "text-green-500";
			break;
		case "copy-error":
			color = "text-red-500";
			break;
		default:
			color = "text-gray-500";
			break;
	}

	return (
		<div className="relative my-0">
			<pre
				className={`${className} ${space.variable} overflow-transparent group my-1 rounded text-sm`}
				{...props}
			>
				<span className="absolute right-4 top-1 flex items-center text-sm font-bold uppercase text-orange-400 md:text-base">
					{lang}
				</span>
				<button
					onClick={copyToClipboard}
					className={`absolute bottom-1 right-3 inline-flex gap-x-1 text-xs md:bottom-4 md:right-4 ${color} rounded p-0.5 font-medium uppercase hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-focus:opacity-100 lg:opacity-0`}
					type="button"
				>
					{copy === "copy" && (
						<>
							<span>{locales.copy}</span>{" "}
							<CopyIcon width={16} height={16} aria-hidden />{" "}
						</>
					)}
					{copy === "copy-success" && (
						<>
							<span>{locales.copied}</span>{" "}
							<CheckIcon width={16} height={16} aria-hidden />{" "}
						</>
					)}
					{copy === "copy-error" && (
						<>
							{" "}
							<span>{locales.error} </span>{" "}
							<XIcon width={16} height={16} aria-hidden />{" "}
						</>
					)}
				</button>
				{cloneElement(children as React.ReactElement, { ref: childrenRef })}
			</pre>
		</div>
	);
};
