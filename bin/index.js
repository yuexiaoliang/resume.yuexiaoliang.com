import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cwd = process.cwd();

init();

function init() {
  const templateDir = resolve(__dirname, '../');
  const targetDir = resolve(cwd, 'create-markdown-to-resume-1');

  console.log({ cwd, templateDir, targetDir });

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, (err) => console.log(err));
  }

  copy(templateDir, targetDir);
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
