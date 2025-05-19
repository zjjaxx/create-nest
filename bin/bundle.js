#!/usr/bin/env node
import { parseArgs } from "node:util";

//#region index.ts
const options = { dir: {
	type: "string",
	short: "d",
	default: "./"
} };
const { values, positionals } = parseArgs({
	args: process.argv.slice(2),
	options
});
console.log(values, positionals);

//#endregion
//# sourceMappingURL=bundle.js.map