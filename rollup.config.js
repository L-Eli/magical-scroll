import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/index.min.js",
      format: "cjs",
      sourcemap: true,
    },
    plugins: [babel({ presets: ["@babel/preset-env"] }), terser()],
  },
];
