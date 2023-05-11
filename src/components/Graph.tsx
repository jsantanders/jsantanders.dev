import { useState } from "react";

import { useGraph } from "@/hooks/use-graph";
import { Days } from "@/ui/Days";
import { LessMore } from "@/ui/LessMore";
import { Months } from "@/ui/Months";
import { Rects } from "@/ui/Rects";

/**
 * Renders the contributions graph.
 * @returns {React.ReactElement} React component
 */
export const Graph: React.FC = () => {
  const { data, isLoading } = useGraph();
  const [hidden, setHidden] = useState(true);
  const [count, setCount] = useState(0);
  const [date, setDate] = useState("");

  // eslint-disable-next-line require-jsdoc
  const handleOnMouseOver = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if ((event.target as SVGSVGElement).matches("rect[data-count]")) {
      const d = (event.target as SVGSVGElement).getAttribute("data-date") as string;
      setDate(d);

      const c = (event.target as SVGSVGElement).getAttribute("data-count") as string;
      setCount(parseInt(c, 10));

      setHidden(false);
    } else {
      setHidden(true);
    }
  };

  // eslint-disable-next-line require-jsdoc
  const handleOnMouseLeave = () => {
    setHidden(true);
  };

  return (
    <div className="mt-16 w-full rounded-md border border-solid border-primary py-2 dark:border-primary md:w-min">
      <div className="relative mx-3 flex flex-col items-end overflow-hidden md:items-center">
        <svg
          width="722"
          height="112"
          onMouseOver={handleOnMouseOver}
          onMouseLeave={handleOnMouseLeave}
        >
          <g transform="translate(10, 20)">
            <Rects data={data} isLoading={isLoading} />
            {!isLoading && (
              <>
                <Months data={data} />
                <Days />
              </>
            )}
          </g>
        </svg>
        <div className="flex w-full flex-row justify-between py-1 md:px-8">
          <div
            className="text-xs"
            style={{
              color: "#9ca3af",
              visibility: hidden ? "hidden" : "visible",
            }}
          >
            <strong className="text-gray-600 dark:text-gray-200">
              {count > 0 ? count : "No"} {count === 1 ? "contribution" : "contributions"}
            </strong>{" "}
            on {date}
          </div>
          {!isLoading && <LessMore />}
        </div>
      </div>
    </div>
  );
};
