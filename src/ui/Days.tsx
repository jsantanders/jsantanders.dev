/**
 * This component renders the spaced days of the week.
 * 'Mon', 'Wed', 'Fri' are rendered.
 * @returns {React.ReactElement} React component
 */
export const Days: React.FC = () => (
  <>
    <text dx="-10" dy="22" style={{ fontSize: "9px", fill: "#9ca3af" }}>
      Mon
    </text>
    <text dx="-10" dy="48" style={{ fontSize: "9px", fill: "#9ca3af" }}>
      Wed
    </text>
    <text dx="-10" dy="73" style={{ fontSize: "9px", fill: "#9ca3af" }}>
      Fri
    </text>
  </>
);
