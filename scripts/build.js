const spawn = require('cross-spawn');

let target = process.argv[2];
const alias = {
  docs: '@alterai/docs',
  dev: 'alterai',
  ripple: '@alterai/ripple',
  components: '@alterai/components',
};
target = alias[target] || target;

let result;
if (!target) {
  result = spawn.sync('pnpm', ['lerna', 'run', 'build', '--stream'], { stdio: 'inherit' });
} else {
  result = spawn.sync('pnpm', ['lerna', 'run', 'build', '--scope', target, '--stream', '--no-prefix'], { stdio: 'inherit' });
}

process.exitCode = result.status;