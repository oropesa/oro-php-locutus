import { spawn } from 'node:child_process';
import fs from 'node:fs';

function exec(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true, stdio: 'inherit' });
    child.on('close', (code) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      code === 0 ? resolve() : reject(new Error(`exec failed with exit code ${code}. \ncommand: "${command}"`));
    });
  });
}

function getDepsFromArgs(args) {
  const customDeps = {};
  for (const dependency of args) {
    const atIndex = dependency.lastIndexOf('@');
    if ([-1, 0].includes(atIndex)) continue;

    customDeps[dependency.slice(0, atIndex)] = dependency.slice(atIndex + 1);
  }
  return customDeps;
}

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  console.log('❇️ Node version');
  await exec('node -v');
  console.log('');
  console.log('ℹ️ SCRIPT START');

  const customDeps = getDepsFromArgs(process.argv.slice(2));
  console.log(`📟 Target packages: ${JSON.stringify(customDeps)}`);

  //

  const initialPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const initialDeps = initialPackage.dependencies || {};
  const initialDevDeps = initialPackage.devDependencies || {};

  const deps = Object.keys(initialDeps);
  const devDeps = Object.keys(initialDevDeps);

  console.log('');
  console.log(`✔️ there are ${deps.length} deps to check`);
  console.log(`✔️ there are ${devDeps.length} dev-deps to check`);
  console.log('');

  if (deps.length > 0) {
    const command = `npm i ${deps.map((name) => (customDeps[name] ? `${name}@${customDeps[name]}` : `${name}@latest`)).join(' ')}`;
    console.log(`📟 exec "${command}"`);
    await exec(command);
  }

  if (devDeps.length > 0) {
    const command = `npm i -D ${devDeps.map((name) => (customDeps[name] ? `${name}@${customDeps[name]}` : `${name}@latest`)).join(' ')}`;
    console.log(`📟 exec "${command}"`);
    await exec(command);
  }

  //

  const updatedPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const updatedDeps = updatedPackage.dependencies || {};
  const updatedDevDeps = updatedPackage.devDependencies || {};

  const depDiffs = deps.reduce(
    (diffs, name) =>
      initialDeps[name] === updatedDeps[name]
        ? diffs
        : [...diffs, { name, prev: initialDeps[name].slice(1), next: updatedDeps[name].slice(1) }],
    [],
  );

  const devDepsDiffs = devDeps.reduce(
    (diffs, name) =>
      initialDevDeps[name] === updatedDevDeps[name]
        ? diffs
        : [...diffs, { name, prev: initialDevDeps[name].slice(1), next: updatedDevDeps[name].slice(1) }],
    [],
  );

  console.log('');
  console.log(`✔️ there are ${depDiffs.length} deps to have been updated`);
  console.log(`✔️ there are ${devDepsDiffs.length} dev-deps to have been updated`);
  console.log('');

  if (depDiffs.length > 0) {
    console.log(
      `\n\n- Update libs:
${depDiffs.map(({ name, prev, next }) => `  - \`${name}\` from \`v${prev}\` to \`v${next}\`.`).join('\n')}
\n\n`,
    );
  }

  if (devDepsDiffs.length > 0) {
    console.log(
      `\n\n- Update _dev_ libs:
${devDepsDiffs.map(({ name, prev, next }) => `  - \`${name}\` from \`v${prev}\` to \`v${next}\`.`).join('\n')}
\n\n`,
    );
  }

  //

  console.log('ℹ️ SCRIPT END');
})();
