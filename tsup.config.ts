import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  outDir: 'bin',
  splitting: false,
  sourcemap: true,
  dts:true,
  watch:false,
  clean: true,
  minify:true,
  shims: true,
  format:['esm']
})