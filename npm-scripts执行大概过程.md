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

调试流程：

* 从npm的bin目录进去，找到npm-cli.js， 里面关键句`npm.commands[npm.command]`

* 进入lib/npm.js，找npm.commands，定位到commandCache[a]，这个函数执行`cmd.apply`, cmd ~= require(a+'.js'), a = `run`, 这样就进入run-script.js，实际上看到lib目录时，应该是能知道run xxx是由run-script.js处理的。

* run-script.js里有run方法，run方法最后调用chain执行`[lifecycle, pkg, c, wd, { unsafePerm: true }]`,chain类型promise链式调用，而每个数组构成了`lifecycle(pkg, c, wd...)`这种方法，细节不深究， 总之引导到了lifecycle方法

* `util/lifecycle.js`调用了`npm-lifecycle`包，转到npm-lifecycle源码查看

* 由npm-lifecycle的index.js进入，经由`lifecycle->lifecycle_->chain([runHookLifeCycle])->runCmd->runCmd_->spawn`路径，最终知道npm脚本由一个spawn子进程运行，分别测试on('error')和on('close'),发现报错执行了close里的方法，现在进入spawn方法，看看是哪里报错

* spawn中有`_spawn`方法，这是标准的node spawn方法，这个方法报错了，查看了参数，均无异常，那么说明env spawn执行环境出了问题，打印options，发现PATH变量中有一条指向了工程目录的`node_modules/.bin`，打开该文件，明白了：

```
npm script执行时会开启一个子进程，该子进程会将node_modules/.bin添加到PATH环境变量中，那么子进程就会搜索.bin下的执行文件。
```

解决办法来了，只要我们将/solid/node_modules里的.bin下的命令软连接到/demo/node_modules的.bin下，那就应该能执行成功。试试吧。

【fix】再仔细了.bin的执行文件来源，它本身就是同级node_modules包里的执行脚本软连接，因此，.bin下如果是相对软连接路径，应该保持原样，不然执行脚本的时候会出现引用错误的尴尬问题。


