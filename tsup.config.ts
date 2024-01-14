import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import readline from 'node:readline';
import { defineConfig } from 'tsup';

export default defineConfig({
  outDir: './dist',
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  async onSuccess() {
    await setIstanbulIgnoreLines();
  },
});

const TSUP_VARIABLES = ['__require'];

async function setIstanbulIgnoreLines() {
  const timeStart = performance.now();

  const tsupVariables = new Set(TSUP_VARIABLES);

  const indexpath = './dist/index.js';
  const tmppath = './dist/tmp.js';

  const input = fs.createReadStream(indexpath);
  const tmp = fs.createWriteStream(tmppath);

  readline
    .createInterface({ input, terminal: false })
    .on('line', (line) => {
      if (tsupVariables.size === 0) {
        tmp.write(`${line}\n`);
        return;
      }

      const piece = line.slice(4, line.indexOf('=') - 1);
      if (!tsupVariables.has(piece)) {
        tmp.write(`${line}\n`);
        return;
      }

      tsupVariables.delete(piece);
      tmp.write(`// istanbul ignore next\n${line}\n`);
    })
    .on('close', async () => {
      await fsp.unlink(indexpath);
      await fsp.rename(tmppath, indexpath);

      const ms = (performance.now() - timeStart).toFixed(0);
      process.stdout.write(`\u001B[91mCVG\u001B[0m ⚡️ Build success in ${ms}ms\n`);
    });
}
