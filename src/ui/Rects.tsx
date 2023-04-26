import React from "react";

type LoadingWeeks = {
  days: Array<LoadingDays>;
};

type LoadingDays = {
  count: number;
  level: string;
  date: string;
};

/**
 * Get the level of the rect.
 * @param {string} level represents year quarter
 * @returns {string} the level
 */
const getLevel = (level: string): string => {
  switch (level) {
    case "NONE":
      return "0";
    case "FIRST_QUARTILE":
      return "1";
    case "SECOND_QUARTILE":
      return "2";
    case "THIRD_QUARTILE":
      return "3";
    case "FOURTH_QUARTILE":
      return "4";
    default:
      return "-1";
  }
};

/**
 * SVG element that renders a graph.
 * @param {GraphData} data the data to render
 * @returns {React.ReactElement} React component
 */
const G: React.FC<React.PropsWithChildren<{ i: number }>> = ({ children, i }) => (
  <g transform={`translate(${i * 14}, 0)`}>{children}</g>
);

/**
 * Render a rect element based on contribution data.
 * @param {Object} props i and j are the index of the rect, count is the number of contributions, level is the quarter of the contribution, date is the date of the contribution
 * @returns {React.ReactElement} React component
 */
const Rect: React.FC<{
  i: number;
  j: number;
  count: number;
  level: string;
  date: string;
}> = ({ i, j, count, level, date }) => (
  <rect
    className={level === "loading" ? "animate-pulse" : undefined}
    width="10"
    height="10"
    x={`${14 - i}`}
    y={`${j * 13}`}
    rx="2"
    ry="2"
    data-count={count}
    data-level={getLevel(level)}
    data-date={date}
  />
);

/**
 * Render an array of rect elements based on contribution data.
 * @param {GraphData} data the data to render
 * @param {boolean} isLoading whether the data is loading
 * @returns {React.ReactElement} React component
 **/
export const Rects: React.FC<{ data?: GraphData; isLoading: boolean }> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <>
        {Array<LoadingWeeks>(53)
          .fill({
            days: Array<LoadingDays>(7).fill({
              count: -1,
              level: "loading",
              date: "loading",
            }),
          })
          .map((week, i: number) => (
            <G key={i} i={i}>
              {week.days.map((day, j: number) => (
                <Rect key={j} i={i} j={j} count={day.count} level={day.level} date={day.date} />
              ))}
            </G>
          ))}
      </>
    );
  }

  return (
    <>
      {data?.graph?.viewer?.contributionsCollection?.contributionCalendar?.weeks?.map(
        (week, i: number) => (
          <G key={i} i={i}>
            {week?.contributionDays?.map((day, j: number) => (
              <Rect
                key={j}
                i={i}
                j={day.weekday}
                count={day.contributionCount}
                level={day.contributionLevel}
                date={day.date}
              />
            ))}
          </G>
        )
      )}
    </>
  );
};
