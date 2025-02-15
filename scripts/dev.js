const spawn = require("cross-spawn");

let target = process.argv[2];
const alias = {
  docs: "@alterai/docs",
};
target = alias[target] || target;

if (!target) {
  spawn("pnpm", ["lerna", "run", "dev", "--scope", alias.docs, "--stream"], {
    stdio: "inherit",
  });
} else {
  spawn("pnpm", ["lerna", "run", "dev", "--scope", target, "--stream"], {
    stdio: "inherit",
  });
}
