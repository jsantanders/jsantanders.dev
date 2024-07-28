"use client";

import { AnalyticsContext } from "@/components/analytics-context";
import { cn } from "@/lib/utils";
import { getQueryClient } from "@/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import React, {
	type CSSProperties,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { getBlogPostStatistics, rateBlogPost } from "./fetch-post-statistics";

type RatingSymbolProps = {
	index: number;
	inactiveIcon: string | object | React.ReactElement;
	activeIcon: string | object | React.ReactElement;
	percent: number;
	readonly?: boolean;
	onClick?: (
		index: number,
		event: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
	) => void;
	onMouseMove?: (
		index: number,
		event: React.MouseEvent | React.TouchEvent,
	) => void;
	onTouchEnd?: (index: number, event: React.TouchEvent) => void;
};

type RatingProps = {
	readonly?: boolean;
	initialValue: number;
	fractions?: number;
	className?: string;
	id?: string;
	style?: React.CSSProperties;
	tabIndex?: number;
	onHover?: (value?: number) => void;
	onClick?: (
		value: number,
		event: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
	) => void;
};

type PostRatingProps = {
	slug: string;
	className?: string;
	locales: {
		thanks: string;
		title: string;
		votes: string;
	};
};

export const PostRating: React.FC<PostRatingProps> = ({
	slug,
	locales,
	className,
}) => {
	const { userId } = useContext(AnalyticsContext);

	const { data } = useQuery({
		queryKey: ["posts-statistics", slug],
		queryFn: () => getBlogPostStatistics(slug),
	});

	const { mutate: ratePost } = useMutation({
		mutationFn: (rating: number) => rateBlogPost(slug, userId, rating),
		onSuccess: () =>
			getQueryClient().invalidateQueries({
				queryKey: ["posts-statistics", slug],
			}),
	});

	if (data === undefined) return <></>;

	return (
		<div className={cn("flex flex-col items-center justify-center", className)}>
			<h3 className="pb-2 text-center text-xl font-bold lg:text-2xl">
				{data.userHasRated ? locales.thanks : locales.title}
			</h3>
			<Rating
				readonly={data.userHasRated}
				initialValue={data.userHasRated ? data.rating.average : 0}
				fractions={2}
				onClick={(rate) => ratePost(rate)}
			/>
			{data.userHasRated && (
				<div className="py-2">
					<span className="text-2xl font-bold">
						{data.rating.average.toFixed(1)}
					</span>
					<span className="text-md font-bold"> / 5.0 </span>
					<span className="text-md font-bold">
						({data.rating.total} {locales.votes})
					</span>
				</div>
			)}
		</div>
	);
};

const Rating: React.FC<RatingProps> = ({
	readonly = false,
	initialValue = 0,
	fractions = 1,
	className,
	id,
	style,
	tabIndex,
	onHover,
	onClick,
}: RatingProps) => {
	const [displayValue, setDisplayValue] = useState<number>(initialValue);
	const totalSymbols = 5;

	useEffect(() => {
		setDisplayValue(initialValue);
	}, [initialValue]);

	const onMouseLeave = useCallback(() => {
		setDisplayValue(initialValue);
		onHover?.();
	}, [onHover, initialValue]);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const calculateHoverPercentage = useCallback((event: any) => {
		const clientX =
			event.nativeEvent.type.indexOf("touch") > -1
				? event.nativeEvent.type.indexOf("touchend") > -1
					? event.changedTouches[0].clientX
					: event.touches[0].clientX
				: event.clientX;

		const targetRect = event.currentTarget?.getBoundingClientRect();
		const delta = clientX - targetRect.left;

		return delta < 0 ? 0 : delta / targetRect.width;
	}, []);

	const calculateDisplayValue = useCallback(
		(
			symbolIndex: number,
			event: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		) => {
			const percentage = calculateHoverPercentage(event);
			const fraction = Math.ceil((percentage % 1) * fractions) / fractions;
			const precision = 10 ** 3;
			let calculatedValue =
				symbolIndex +
				(Math.floor(percentage) + Math.floor(fraction * precision) / precision);
			calculatedValue =
				calculatedValue > 0
					? calculatedValue > totalSymbols
						? totalSymbols
						: calculatedValue
					: 1 / fractions;
			return calculatedValue;
		},
		[calculateHoverPercentage, fractions],
	);
	const symbolClick = useCallback(
		(
			symbolIndex: number,
			event: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
		) => {
			const calculatedValue = calculateDisplayValue(symbolIndex, event);
			onClick?.(calculatedValue, event);
		},
		[calculateDisplayValue, onClick],
	);

	const symbolEnd = useCallback(
		(symbolIndex: number, event: React.MouseEvent | React.TouchEvent) => {
			symbolClick(symbolIndex, event);
			event.preventDefault();
			onMouseLeave();
		},
		[onMouseLeave, symbolClick],
	);

	const symbolMouseMove = useCallback(
		(symbolIndex: number, event: React.MouseEvent | React.TouchEvent) => {
			const calculatedValue = calculateDisplayValue(symbolIndex, event);
			setDisplayValue(calculatedValue);
			onHover?.(calculatedValue);
		},
		[calculateDisplayValue, onHover],
	);

	const symbolNodes = [];
	const renderedValue = displayValue;

	const fullSymbols = Math.floor(renderedValue);

	for (let i = 0; i < totalSymbols; i++) {
		let percent: number;
		// Calculate each symbol's fullness percentage
		if (i - fullSymbols < 0) {
			percent = 100;
		} else if (i - fullSymbols === 0) {
			percent = (renderedValue - i) * 100;
		} else {
			percent = 0;
		}

		symbolNodes.push(
			<RatingSymbol
				key={i}
				index={i}
				readonly={readonly}
				inactiveIcon={
					<Star fill="#9ca3af" className="h-10 w-10 text-gray-400" />
				}
				activeIcon={
					<Star fill="#eab308" className="h-10 w-10 text-yellow-500" />
				}
				percent={percent}
				{...(!readonly && {
					onClick: symbolClick,
					onMouseMove: symbolMouseMove,
					onTouchMove: symbolMouseMove,
					onTouchEnd: symbolEnd,
				})}
			/>,
		);
	}

	return (
		<span
			id={id}
			style={{ ...style, display: "inline-block" }}
			className={className}
			tabIndex={tabIndex}
			{...(!readonly && {
				onMouseLeave: onMouseLeave,
			})}
		>
			{symbolNodes}
		</span>
	);
};

const RatingSymbol: React.FC<RatingSymbolProps> = ({
	index,
	inactiveIcon,
	activeIcon,
	percent,
	readonly = false,
	onClick,
	onMouseMove,
	onTouchEnd,
}) => {
	const [touchMoved, setTouchMoved] = useState(false);

	const backgroundNode = _iconNode(inactiveIcon);
	const showbgIcon = percent < 100;
	const bgIconContainerStyle: CSSProperties = showbgIcon
		? {}
		: { visibility: "hidden" };
	const iconNode = _iconNode(activeIcon);
	const iconContainerStyle: CSSProperties = {
		display: "inline-block",
		position: "absolute",
		overflow: "hidden",
		top: 0,
		width: `${percent}%`,
	};
	const style: CSSProperties = {
		cursor: !readonly ? "pointer" : "inherit",
		display: "inline-block",
		position: "relative",
	};

	function handleMouseMove(e: React.MouseEvent | React.TouchEvent) {
		if (onMouseMove) {
			onMouseMove(index, e);
		}
	}

	function handleMouseClick(e: React.MouseEvent | React.TouchEvent) {
		if (onClick && !touchMoved) {
			onClick(index, e);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter" && onClick) {
			onClick(index, e);
		}
	}

	function handleTouchEnd(e: React.TouchEvent) {
		if (onTouchEnd && !touchMoved) {
			onTouchEnd(index, e);
		}
	}

	function handleTouchMove() {
		setTouchMoved(true);
	}

	return (
		<span
			role="button"
			style={style}
			onClick={handleMouseClick}
			onKeyDown={handleKeyDown}
			onMouseMove={handleMouseMove}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			tabIndex={index}
		>
			<span style={bgIconContainerStyle}>{backgroundNode}</span>
			<span style={iconContainerStyle}>{iconNode}</span>
		</span>
	);
};

// Return the corresponding React node for an icon.
function _iconNode(
	icon: RatingSymbolProps["inactiveIcon"] | RatingSymbolProps["activeIcon"],
) {
	// If it is already a React Element just return it.
	if (React.isValidElement(icon)) {
		return icon;
	}
	// If it is an object, try to use it as a CSS style object.
	if (typeof icon === "object" && icon !== null) {
		return <span style={icon as CSSProperties} />;
	}
	// If it is a string, use it as class names.
	if (Object.prototype.toString.call(icon) === "[object String]") {
		return <span className={icon} />;
	}

	// Otherwise, this is an invalid icon node.
	throw new Error("Invalid icon node.");
}
