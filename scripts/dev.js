const spawn = require('cross-spawn');

let target = process.argv[2];
const alias = {
  docs: 'docs',
};
target = alias[target] || target;

if (!target) {
  spawn('pnpm', ['lerna', 'run', 'dev', '--scope', 'alter-ui', '--stream'], { stdio: 'inherit' });
} else {
  spawn('pnpm', ['lerna', 'run', 'dev', '--scope', target, '--stream'], { stdio: 'inherit' });
}
