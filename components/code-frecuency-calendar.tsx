"use client";

import GitHubCalendar from "react-github-calendar";

export const CodeFrencuencyCalendar = () => {
	return (
		<div className="py-2 px-4 min-h-[192px] border rounded-lg border-muted max-w-full overflow-transparent overflow-hidden">
			<GitHubCalendar
				style={{ width: "100%", overflow: "hidden" }}
				username="jsantanders"
			/>
		</div>
	);
};
