import { defineConfig } from "rolldown";

export default defineConfig({
  input: "index.ts",
  output: {
    sourcemap: true,
    format: "esm",
    file: "./bin/bundle.js",
  },
  platform: "node",
});
