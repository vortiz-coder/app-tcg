// FND-05: runs the real ESLint CLI (repo config) in a child process; i18next/no-literal-string must catch literal
// UI text. Not in-process: Jest's module system breaks ESLint's config loader and the plugin's rule loading.
const { spawnSync } = require("node:child_process");
const { join, resolve } = require("node:path");

const root = resolve(__dirname, "../../..");
const eslintBin = join(root, "node_modules/eslint/bin/eslint.js"); // root devDependency; not exported by the package

const offences = (args, input) => {
  const run = spawnSync(process.execPath, [eslintBin, "--format", "json", ...args], { cwd: root, input, encoding: "utf8" });
  if (run.status === 2) throw new Error(run.stderr);
  return JSON.parse(run.stdout).flatMap((r) =>
    r.messages.filter((m) => m.ruleId === "i18next/no-literal-string").map((m) => `${r.filePath}:${m.line}`),
  );
};

test("the rule flags literal JSX text", () => {
  const found = offences(["--stdin", "--stdin-filename", "apps/mobile/app/__probe__.tsx"], "export default function Screen() {\n  return <Text>Hola</Text>;\n}\n");
  expect(found).toHaveLength(1);
}, 60_000);

test("no UI strings outside translation files", () => {
  const found = offences(["--no-error-on-unmatched-pattern", "apps/mobile/app", "apps/mobile/src"]);
  expect(found).toEqual([]);
}, 60_000);
