import * as MafsRoot from "mafs";

const Mafs = MafsRoot.Mafs;

Object.assign(Mafs, {
	...MafsRoot,
});

export { Mafs };
