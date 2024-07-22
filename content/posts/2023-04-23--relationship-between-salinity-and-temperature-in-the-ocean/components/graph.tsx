"use client";

import { Mafs, Coordinates, Plot, Theme } from "mafs";
export default function Graph() {
  return (
    <Mafs>
      <Coordinates.Cartesian />
      <Plot.OfX y={Math.sin} color={Theme.blue} />
      <Plot.OfY x={Math.cos} color={Theme.pink} />
    </Mafs>
  );
}
