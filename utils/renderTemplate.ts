import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";

import deepMerge from "./deepMerge";
import sortDependencies from "./sortDependencies";

/**
 * Renders a template folder/file to the file system,
 * by recursively copying all files under the `src` directory,
 * with the following exception:
 *   - `_filename` should be renamed to `.filename`
 *   - Fields in `package.json` should be recursively merged
 * @param {string} src source filename to copy
 * @param {string} dest destination filename of the copy operation
 */
function renderTemplate(src, dest, callbacks) {
  // 使用 fs.statSync 方法同步获取 src 路径对应的文件或目录的状态信息，
  // 该信息会存储在 stats 变量中，后续可用于判断 src 是文件还是目录等操作。
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    // skip node_module
    if (path.basename(src) === "node_modules") {
      return;
    }

    // 创建目标目录，如果目录已存在则不报错，`recursive: true` 表示会递归创建所有不存在的父目录
    fs.mkdirSync(dest, { recursive: true });
    // 遍历源目录下的所有文件和子目录
    // 使用 fs.readdirSync 同步读取源目录 src 下的所有文件和子目录的名称
    // 然后通过 for...of 循环依次处理每个文件或子目录
    for (const file of fs.readdirSync(src)) {
      // 递归调用 renderTemplate 函数，处理当前文件或子目录
      // path.resolve 用于将源目录和当前文件/子目录名称拼接成完整的源路径
      // 同样，将目标目录和当前文件/子目录名称拼接成完整的目标路径
      // 同时将 callbacks 数组传递给递归调用的函数
      renderTemplate(
        path.resolve(src, file),
        path.resolve(dest, file),
        callbacks
      );
    }
    return;
  }

  const filename = path.basename(src);

  if (filename === "package.json" && fs.existsSync(dest)) {
    // merge instead of overwriting
    const existing = JSON.parse(fs.readFileSync(dest, "utf8"));
    const newPackage = JSON.parse(fs.readFileSync(src, "utf8"));
    const pkg = sortDependencies(deepMerge(existing, newPackage));
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2) + "\n");
    return;
  }
  // 检查文件名是否以 "_" 开头，如果是，则需要将文件名中的 "_" 替换为 "."
  // 这是因为在模板渲染过程中，以 "_" 开头的文件需要重命名为以 "." 开头的文件
  if (filename.startsWith("_")) {
    // 重命名逻辑：将 `_file` 重命名为 `.file`
    // 先获取目标文件所在的目录路径，再将文件名中的 "_" 替换为 "."，最后组合成新的完整路径
    dest = path.resolve(path.dirname(dest), filename.replace(/^_/, "."));
  }

  if (filename === "_gitignore" && fs.existsSync(dest)) {
    // append to existing .gitignore
    const existing = fs.readFileSync(dest, "utf8");
    const newGitignore = fs.readFileSync(src, "utf8");
    fs.writeFileSync(dest, existing + "\n" + newGitignore);
    return;
  }

  // data file for EJS templates
  // 检查文件名是否以 .data.mjs 结尾，如果是，则进行特殊处理
  if (filename.endsWith(".data.mjs")) {
    // 将目标路径中的 .data.mjs 后缀移除，使用处理后的路径作为数据存储的键
    dest = dest.replace(/\.data\.mjs$/, "");

    // 向 callbacks 数组中添加一个异步回调函数，该函数会在处理模板文件时被调用
    callbacks.push(async (dataStore) => {
      // 动态导入 .data.mjs 文件，并获取其默认导出的函数
      const getData = (await import(pathToFileURL(src).toString())).default;

      // 调用 getData 函数，传入包含旧数据的对象，并将结果存储到 dataStore 中
      // 尽管当前的 getData 函数都是同步的，但仍保留异步调用的可能性
      dataStore[dest] = await getData({
        oldData: dataStore[dest] || {},
      });
    });
    // 跳过复制 .data.mjs 文件
    return;
  }
  fs.copyFileSync(src, dest);
}

export default renderTemplate;
