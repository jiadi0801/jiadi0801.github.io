# npm scripts执行大体流程

做个工具，将node_modules以软链接的形式引入到项目中，减少下载时间。然而，将node_modules里的npm包软链接过来后，发现执行不了命令。于是开始对照npm源码调试问题。

在`/export/solid`下安装`jdf-cms`, 在`/export/proj/demo`下创建node_modules目录，并将`/export/solid/node_modules`里的npm包软连接过来。

demo目录下创建了package.json，并添加npm scripts
```JSON
{
  "scripts": {
    "help": "jdf-cms -h"
  }
}
```

执行`npm run help`

报错：

```
sh: jdf-cms: command not found
```
