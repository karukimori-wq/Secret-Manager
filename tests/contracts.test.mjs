import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

test("app does not define secret value fields", () => {
  const files = [
    "lib/types.ts",
    "app/api/contracts/status/route.ts",
  ].map((path) => readFileSync(path, "utf8").toLowerCase());
  for (const content of files) {
    assert.equal(/\b(secretvalue|secret_value|value)\s*[:?]/.test(content), false);
  }
});

test("fixed sheet names are present", () => {
  const content = readFileSync("lib/google-sheets.ts", "utf8");
  for (const sheet of ["Apps", "Secrets", "Services", "Relations", "Links"]) {
    assert.ok(content.includes(sheet));
  }
});
