#!/usr/bin/env node
import { parseArgs } from "node:util";
import cliPackageJson from "./package.json";
import {
  intro,
  text,
  confirm,
  cancel,
  multiselect,
  outro,
} from "@clack/prompts";
import { gradientBanner, defaultBanner } from "./config/banner";
import { FEATURE_OPTIONS } from "./config/feature";
import {
  unwrapPrompt,
  canSkipEmptying,
  isValidPackageName,
  toValidPackageName,
  emptyDir,
} from "./utils/index";
import renderTemplate from "./utils/renderTemplate";
import picocolors from "picocolors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Handlebars from "handlebars";
import { preOrderDirectoryTraverse } from "./utils/directoryTraverse";
import getCommand from "./utils/getCommand";
const { red, green, cyan, bold, dim } = picocolors;
type PromptResult = {
  projectName?: string;
  shouldOverwrite?: boolean;
  packageName?: string;
  features?: (typeof FEATURE_OPTIONS)[number]["value"][];
};
const init = async () => {
  const { values: argv, positionals } = parseArgs({
    args: process.argv.slice(2), // 配置 parseArgs 时指定要解析的参数来源
    options: {
      force: {
        type: "boolean",
        short: "f",
      },
      version: {
        type: "boolean",
        short: "v",
      },
    },
    strict: true, // 严格模式，不允许未知参数
    allowPositionals: true, // 允许位置参数
  });

  if (argv.version) {
    console.log(`${cliPackageJson.name} is v${cliPackageJson.version}`);
    process.exit(0);
  }
  let targetDir = positionals[0];

  const defaultProjectName = targetDir || "nest-project";

  const forceOverwrite = argv.force;
  const result: PromptResult = {
    projectName: defaultProjectName,
    shouldOverwrite: forceOverwrite,
    packageName: defaultProjectName,
    features: [],
  };
  // 根据终端是否支持 TTY 以及颜色深度，选择显示渐变横幅或默认横幅
  intro(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8
      ? gradientBanner
      : defaultBanner
  );

  // 检查目标目录是否未指定
  if (!targetDir) {
    // 调用 unwrapPrompt 函数获取用户输入的项目名称
    const _result = await unwrapPrompt(
      // 使用 @clack/prompts 的 text 函数创建一个文本输入提示
      text({
        // 提示用户输入项目名称
        message: "请输入项目名称",
        // 设置输入框的占位符为默认项目名称
        placeholder: defaultProjectName,
        // 验证用户输入的项目名称是否为空
        validate: (value) =>
          value.trim().length > 0 ? undefined : "项目名称不能为空",
      })
    );
    // 将用户输入的项目名称去除首尾空格后赋值给目标目录、项目名称和包名
    targetDir = result.projectName = result.packageName = _result.trim();
  }
  // 检查目标目录是否不能跳过清空操作，并且没有使用强制覆盖选项
  if (!canSkipEmptying(targetDir) && !forceOverwrite) {
    // 弹出确认提示框，询问用户是否要覆盖非空目录
    result.shouldOverwrite = await unwrapPrompt(
      confirm({
        // 根据目标目录是否为当前目录，生成不同的提示信息
        message: `${
          targetDir === "." ? "当前目录" : `目标文件夹 "${targetDir}"`
        } 非空，是否覆盖？`,
        // 默认值为 false，表示不覆盖
        initialValue: false,
      })
    );
    // 如果用户选择不覆盖，则取消操作并退出程序
    if (!result.shouldOverwrite) {
      cancel(red("✖") + ` 操作取消`);
      process.exit(0);
    }
  }
  // 检查目标目录名称是否为有效的包名
  if (!isValidPackageName(targetDir)) {
    // 若不是有效包名，则通过命令行交互让用户输入有效的包名
    result.packageName = await unwrapPrompt(
      text({
        // 提示用户输入包名称
        message: "请输入包名称：",
        // 设置初始值为转换后的有效包名
        initialValue: toValidPackageName(targetDir),
        // 验证用户输入的包名是否有效
        validate: (value) =>
          isValidPackageName(value) ? undefined : "无效的 package.json 名称",
      })
    );
  }
  result.features = await unwrapPrompt(
    multiselect({
      message: `请选择要包含的功能： ${dim(
        "(↑/↓ 切换，空格选择，a 全选，回车确认)"
      )}`,
      // @ts-expect-error @clack/prompt's type doesn't support readonly array yet
      options: FEATURE_OPTIONS,
      required: false,
    })
  );
  // 拼接当前工作目录和目标目录，得到项目根目录的完整路径
  const root = path.join(process.cwd(), targetDir);
  // 检查项目根目录是否存在，并且用户选择了覆盖目录
  if (fs.existsSync(root) && result.shouldOverwrite) {
    // 若存在且需要覆盖，则清空该目录
    emptyDir(root);
  }
  // 检查项目根目录是否不存在
  else if (!fs.existsSync(root)) {
    // 若不存在，则创建该目录
    fs.mkdirSync(root);
  }
  console.log(`\n正在初始化项目 ${root}...`);
  const pkg = { name: result.packageName, version: "0.0.0" };
  // 初始化package.json文件
  fs.writeFileSync(
    path.resolve(root, "package.json"),
    JSON.stringify(pkg, null, 2)
  );

  const templateRoot = fileURLToPath(new URL("../template", import.meta.url));
  const callbacks = [];
  const render = function render(templateName) {
    const templateDir = path.resolve(templateRoot, templateName);
    renderTemplate(templateDir, root, callbacks);
  };
  render("base");
  if (result.features.includes("auth")) {
    render("config/auth");
    render("code/auth");
  }
  if (result.features.includes("cache")) {
    render("config/cache");
    render("code/cache");
  }
  if (result.features.includes("mail")) {
    render("config/mail");
    render("code/mail");
  }
  if (result.features.includes("swagger")) {
    render("config/swagger");
    render("code/swagger");
  }

  const dataStore = {};
  // Process callbacks
  for (const cb of callbacks) {
    await cb(dataStore);
  }

  // EJS template rendering
  // 调用 preOrderDirectoryTraverse 函数对项目根目录进行前序遍历
  // 第一个参数 root 表示要遍历的根目录路径
  // 第二个参数是一个空函数，意味着在进入目录时不执行任何操作
  // 第三个参数是一个回调函数，会在遍历到每个文件时执行
  preOrderDirectoryTraverse(
    root,
    () => {},
    (filepath) => {
      // 检查当前文件路径是否以 .ejs 结尾，如果是则进行 EJS 模板渲染处理
      if (filepath.endsWith(".handlebars")) {
        // 以 UTF-8 编码读取 .ejs 模板文件的内容
        const template = fs.readFileSync(filepath, "utf-8");
        // 生成渲染后的文件路径，将 .ejs 扩展名移除
        const dest = filepath.replace(/\.handlebars$/, "");
        const c_template=Handlebars.compile(template);
        // 使用 ejs 库对模板进行渲染，传入模板内容和对应的数据
        const content =c_template( dataStore[dest])
        // 将渲染后的内容写入到生成的文件路径中
        fs.writeFileSync(dest, content);
        // 删除原始的 .ejs 模板文件
        fs.unlinkSync(filepath);
      }
    }
  );

  // Instructions:
  // Supported package managers: pnpm > yarn > bun > npm
  const userAgent = process.env.npm_config_user_agent ?? "";
  const packageManager = /pnpm/.test(userAgent)
    ? "pnpm"
    : /yarn/.test(userAgent)
    ? "yarn"
    : /bun/.test(userAgent)
    ? "bun"
    : "npm";

  let outroMessage = `项目初始化完成，可执行以下命令：\n\n`;
  if (root !== process.cwd()) {
    const cdProjectName = path.relative(process.cwd(), root);
    outroMessage += `   ${bold(
      green(
        `cd ${
          cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
        }`
      )
    )}\n`;
  }
  outroMessage += `   ${bold(green(getCommand(packageManager, "install")))}\n`;
  outroMessage += `   ${bold(green(getCommand(packageManager, "dev")))}\n`;

  outroMessage += `
      ${dim("|")} 可选：使用以下命令在项目目录中初始化 Git：
         
         ${bold(
           green('git init && git add -A && git commit -m "initial commit"')
         )}`;

  outro(outroMessage);
};

init().catch((e) => {
  console.error(e);
  process.exit(1);
});
