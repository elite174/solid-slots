import withSolid from "rollup-preset-solid";

export default withSolid([
  {
    input: "src/lib/index.tsx",
    targets: ["esm", "cjs"],
  },
]);
