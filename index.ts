#!/usr/bin/env node
import { parseArgs } from "node:util";
const options = {
  dir: {
    type: "string",
    short: "d",
    default: "./",
  },
};
const { values, positionals } = parseArgs({ args:process.argv.slice(2), options });
console.log(values, positionals);
