/**
 * Render the month name.
 * @param {number} i the index of the month
 * @returns {React.ReactElement} React component
 */
const Month: React.FC<React.PropsWithChildren<{ i: number }>> = ({ children, i }) => (
  <text x={`${14 + i}`} y="-7" style={{ fontSize: "9px", fill: "#9ca3af" }}>
    {children}
  </text>
);

/**
 * Render the month names.
 * @param {GraphData} data the graph data
 * @returns {React.ReactElement} React component
 */
export const Months: React.FC<{ data?: GraphData }> = ({ data }) => {
  let sum = 0;

  return (
    <>
      {data?.graph?.viewer?.contributionsCollection?.contributionCalendar?.months?.map(
        (month, i) => {
          const el = (
            <Month key={i} i={sum}>
              {month.name}
            </Month>
          );
          sum += 13 * month.totalWeeks;
          return el;
        }
      )}
    </>
  );
};
