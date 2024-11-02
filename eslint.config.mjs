import kirklin from "@kirklin/eslint-config";
import { tsImport } from "tsx/esm/api";

const local = await tsImport("./src/index.ts", import.meta.url).then(r => r.default);

export default kirklin(
  {
    type: "lib",
  },
  {
    ignores: ["vendor"],
  },
  {
    name: "tests",
    files: ["**/*.test.ts"],
    rules: {
      "kirklin/indent-unindent": "error",
    },
  },
  {
    rules: {
      "unicorn/consistent-function-scoping": "off",
      "kirklin/consistent-chaining": "error",
    },
  },
)
// replace local config
  .onResolved((configs) => {
    configs.forEach((config) => {
      if (config?.plugins?.kirklin) {
        config.plugins.kirklin = local;
      }
    });
  });
