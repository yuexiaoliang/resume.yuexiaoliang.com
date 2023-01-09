#!/usr/bin/env node

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import inquirer from 'inquirer';
import colors from 'colors';

colors.setTheme({
  success: 'green',
  warn: 'yellow',
  error: 'red',
  info: 'cyan'
});
const error = colors.error;
const success = colors.success;
const info = colors.info;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cwd = process.cwd();
const argv = process.argv;

let projectName = argv[2];

init();

async function init() {
  if (!projectName) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入简历名称',
        default: 'my-resume'
      }
    ]);
    projectName = answers.name;
  }
  const templateDir = resolve(__dirname, '../');
  const targetDir = resolve(cwd, projectName);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  } else {
    console.log(error(`文件夹[${projectName}]已存在`));
    return;
  }

  copy(templateDir, targetDir);

  console.log(success('简历创建完成'));
  console.log(`编写简历，运行：`);
  console.log(info(`  1. cd ${projectName}`));
  console.log(info('  2. pnpm install'));
  console.log(info('  3. pnpm run dev'));
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = resolve(srcDir, file);
    const destFile = resolve(destDir, file);
    copy(srcFile, destFile);
  }
}
