"use client";

import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import React, { forwardRef } from "react";
import Calendar, {
	type Props as ActivityCalendarProps,
	type Activity,
	Skeleton,
} from "react-activity-calendar";
import { Tooltip } from "react-tooltip";

export interface Props extends Omit<ActivityCalendarProps, "data" | "theme"> {
	errorMessage?: string;
	theme?: ThemeInput;
	throwOnError?: boolean;
	transformData?: (data: Array<Activity>) => Array<Activity>;
	transformTotalCount?: boolean;
	year?: Year;
	labels: ActivityCalendarProps["labels"] & { activities?: string };
}

type Color = string;
type ColorScale = [Color, Color, Color, Color, Color];

export type ThemeInput =
	| {
			light: ColorScale | [from: Color, to: Color];
			dark?: ColorScale | [from: Color, to: Color];
	  }
	| {
			light?: ColorScale | [from: Color, to: Color];
			dark: ColorScale | [from: Color, to: Color];
	  };

export type Year = number | "last";

export interface ApiResponse {
	total: {
		[year: number]: number;
		[year: string]: number; // lastYear;
	};
	contributions: Array<Activity>;
}

export interface ApiErrorResponse {
	error: string;
}

async function fetchCalendarData(): Promise<ApiResponse> {
	const response = await fetch("/api/github/contributions");
	const data: ApiResponse | ApiErrorResponse = await response.json();

	if (!response.ok) {
		throw Error(
			`Fetching GitHub contribution data failed: ${(data as ApiErrorResponse).error}`,
		);
	}

	return data as ApiResponse;
}

export const CodeFrencuencyCalendar = forwardRef<HTMLElement, Props>(
	({ labels, ...props }, ref) => {
		const { resolvedTheme } = useTheme();

		//HACK: L0 color is defined also in the main css (global.css)
		// because the calendar is not taking the color. idkw
		const colors: ThemeInput = {
			light: ["#e5e5e5", "#a1a1aa", "#6b7280", "#374151", "#111827"],
			dark: ["#171717", "#3f3f46", "#71717a", "#a1a1aa", "#d4d4d8"],
		};

		const { data, isLoading, isError, error } = useQuery({
			queryKey: ["github-contributions"],
			queryFn: fetchCalendarData,
		});

		if (isError) {
			return <div>{error.message}</div>;
		}

		return (
			<div className="py-2 px-4 min-h-[192px] border rounded-lg border-muted max-w-full overflow-transparent">
				{isLoading || data === undefined ? (
					<Skeleton
						style={{ width: "100%", overflow: "hidden" }}
						{...props}
						loading
					/>
				) : (
					<>
						<Calendar
							ref={ref}
							maxLevel={4}
							style={{ width: "100%", overflow: "hidden" }}
							labels={labels}
							theme={colors}
							colorScheme={resolvedTheme as "dark" | "light"}
							loading={isLoading}
							data={data.contributions}
							totalCount={data.total.lastYear}
							renderBlock={(block, activity) =>
								React.cloneElement(block, {
									"data-tooltip-id": "activity-calendar",
									"data-tooltip-html": `${activity.count} ${labels?.activities} ${activity.date}`,
								})
							}
						/>
						<Tooltip id="activity-calendar" />
					</>
				)}
			</div>
		);
	},
);
