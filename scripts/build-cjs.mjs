import * as esbuild from "esbuild";
import { writeFile } from "node:fs/promises";

await esbuild.build({
  entryPoints: ["lib/errr.js"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: "dist/errr-internals.cjs"
});

await writeFile(
  "dist/errr.cjs",
  `'use strict';

module.exports = require("./errr-internals.cjs").default;
`
);
