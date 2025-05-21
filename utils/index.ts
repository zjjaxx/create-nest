import {
  intro,
  outro,
  text,
  confirm,
  multiselect,
  select,
  isCancel,
  cancel,
} from "@clack/prompts";
import picocolors from "picocolors";
import * as fs from "node:fs";
import path from "node:path";
const { red, green, cyan, yellow } = picocolors;

export async function unwrapPrompt<T>(
  maybeCancelPromise: Promise<T | symbol>
): Promise<T> {
  const result = await maybeCancelPromise;
  if (isCancel(result)) {
    cancel(red("✖") + ` 操作取消`);
    process.exit(0);
  }
  return result;
}
export function canSkipEmptying(dir: string) {
  if (!fs.existsSync(dir)) {
    return true;
  }

  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    return true;
  }
  if (files.length === 1 && files[0] === ".git") {
    return true;
  }

  return false;
}
export function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  );
}

export function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z0-9-~]+/g, "-");
}
export function postOrderDirectoryTraverse(dir, dirCallback, fileCallback) {
  for (const filename of fs.readdirSync(dir)) {
    if (filename === ".git") {
      continue;
    }
    const fullpath = path.resolve(dir, filename);
    if (fs.lstatSync(fullpath).isDirectory()) {
      postOrderDirectoryTraverse(fullpath, dirCallback, fileCallback);
      dirCallback(fullpath);
      continue;
    }
    fileCallback(fullpath);
  }
}

export function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file)
  );
}
