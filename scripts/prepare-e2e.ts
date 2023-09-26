import path from 'path';
import fse from 'fs-extra';
import * as execa from 'execa';

const exampleDir = path.resolve(__dirname, '../e2e/playground/basic');

const rootDir = path.resolve(__dirname, '..');

const defaultExecaOpts = {
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
};

async function prepareE2E() {
  if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
    execa.commandSync('pnpm build', {
      cwd: rootDir,
      ...defaultExecaOpts
    });
  }

  execa.commandSync('npx playwright install', {
    cwd: rootDir,
    ...defaultExecaOpts
  });

  execa.commandSync('pnpm dev', {
    cwd: exampleDir,
    ...defaultExecaOpts
  });
}

prepareE2E();
