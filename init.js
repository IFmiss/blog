import chalk from 'chalk';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dateFormat, { masks } from "dateformat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathPosts = path.join(__dirname, "posts");

const n = (process.argv.slice(2)[0] || "").trim();
const noDir = process.argv.slice(3)[0] === '-n'

if (n) {
  try {
    const now = new Date();
    !noDir && fs.mkdirSync(`${pathPosts}/${n}`)
    fs.writeFileSync(`${pathPosts}/${n}.md`, (`
      ---
      title: '${n}'
      date: ${dateFormat(now, "yyyy-mm-dd HH:MM:ss")}
      categories:
      tags: []
      ---
    `)
    .replace(/^\n/, '').replace(new RegExp(
      `^${' '.repeat(6)}`,
      'gm'
    ), '')
    .replace(/(\x20*)$/gm, ''));

    console.info(`${chalk.green("Create Success:")} ${chalk.underline(`${pathPosts}/${n}.md`)}`)
    exec(`code ${pathPosts}/${n}.md`)
  } catch (e) {
    if (e.errno === -17) {
      console.info(chalk.yellow("File already exists, create failed."))
    } else {
      console.error(e);
    }
  }
}