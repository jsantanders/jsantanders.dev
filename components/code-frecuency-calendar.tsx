"use client";

import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import GitHubCalendar, { type ThemeInput } from "react-github-calendar";

type Props = Omit<ComponentProps<typeof GitHubCalendar>, "username">;

export const CodeFrencuencyCalendar = ({ labels }: Props) => {
	const { theme } = useTheme();

	const colors: ThemeInput = {
		light: ["#e5e5e5", "#a1a1aa", "#6b7280", "#374151", "#111827"],
		dark: ["#171717", "#3f3f46", "#71717a", "#a1a1aa", "#d4d4d8"],
	};

	return (
		<div className="py-2 px-4 min-h-[192px] border rounded-lg border-muted max-w-full overflow-transparent">
			<GitHubCalendar
				style={{ width: "100%", overflow: "hidden" }}
				username="jsantanders"
				labels={labels}
				theme={colors}
				//@ts-ignore
				colorScheme={theme}
			/>
		</div>
	);
};
