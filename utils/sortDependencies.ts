// 此函数的作用是对 package.json 文件中的依赖项进行排序。
// 输入参数为一个表示 package.json 内容的对象。
export default function sortDependencies(packageJson) {
  // 用于存储排序后的依赖项的对象
  const sorted = {}

  // 定义需要排序的依赖项类型数组
  const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

  // 遍历每种依赖项类型
  for (const depType of depTypes) {
    // 检查 package.json 中是否存在该类型的依赖项
    if (packageJson[depType]) {
      // 初始化排序后的该类型依赖项对象
      sorted[depType] = {}

      // 获取该类型依赖项的所有键名，排序后遍历
      Object.keys(packageJson[depType])
        .sort()
        .forEach((name) => {
          // 将排序后的依赖项复制到 sorted 对象中
          sorted[depType][name] = packageJson[depType][name]
        })
    }
  }

  // 返回原始的 package.json 对象，并覆盖排序后的依赖项
  return {
    ...packageJson,
    ...sorted,
  }
}
