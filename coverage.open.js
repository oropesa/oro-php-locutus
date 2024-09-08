#!/usr/bin/env node
import { exec } from 'node:child_process';
import os from 'node:os';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
os.platform() === 'win32'
  ? exec(`start ./coverage/lcov-report/index.html`)
  : exec(`open ./coverage/lcov-report/index.html`);
