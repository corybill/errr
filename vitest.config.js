import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["spec/unit/**/*-spec.js", "spec/maddox/**/*-spec.js"],
    pool: "threads",
    fileParallelism: true
  }
});
