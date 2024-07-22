"use client";

import GitHubCalendar from "react-github-calendar";

export const CodeFrencuencyCalendar = () => {
  return (
    <div className="p-2 border rounded-lg border-muted max-w-full overflow-transparent overflow-hidden">
      <GitHubCalendar style={{ width: "fit-content" }} username="jsantanders" />
    </div>
  );
};
