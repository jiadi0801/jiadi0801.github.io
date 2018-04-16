# 从零经验到上线JDReact(RN)项目

## 目标
笔者在做JDReact项目之前，只有一个React项目经验(React + Mobx)，而RN项目，曾数次打开RN官方文档，看着自己的Windows电脑默默的又把页面关了，因此，对于RN以及JDReact，仅停留在这是一个拥有独特标签的React库，毕竟写法还是React形式嘛，毕竟如何转Native,如何转Web，也不是现在关心的事嘛。

在着手JDReact开发后，发现它不仅仅只是一个React库那么简单，它的周边及组件库都有很多挑战，笔者刚开始做时反复看了JDReact的官方文档多遍，也问了很多人，但毕竟刚接触RN开发，JDReact又在RN之上增加了一些京东相关的能力，混杂在一起，上手曲线挺大。

写本文的目标是让初用JDReact的用户能通过这篇文章上手JDReact。相信在上手之后，后续的开发会一坦平洋。


JDReact能够在Windows上开发iOS项目。

## Hello World
### 申请接入
【】占坑

### 启动开发环境
在申请成功后，开发人员会加入一个已初始化成功的JDReact项目。这个项目是可直接运行的，启动项目成功后在手机上会看到“Hello, yourPrjectName”。

```jsx
    render() {
        return (
            <View style={styles.container}>
                <JDText>Hello, {yourProjectName}</JDText>
            </View>
        );
    }
```

那么如何启动这个项目呢？

嗯，clone到本地，`npm install`，然后在`package.json`里找找哪条命令像启动命令，就是它了！`npm start`。

实际上，你可能在npm install时就出错了，因为JDReact项目目前要依托京东的npm内部库。

#### 京东npm和yarn

京东npm仓库地址为：http://registry.m.jd.com/。 可使用nrm来管理npm仓库。

如果用Mac开发，可能就不需要yarn，但是用Windows，`npm install or npm start`时你可能会遇到`errno 3221225477`安装错误(似乎是npm在windows上的一个bug)，这时候用`yarn install`来安装能够避免这个错误。

配好registry后用`yarn install`安装依赖包，接着执行`npm start`。

项目启动后，入口在哪呢？怎么在手机上调试呢？可利用`npm start debug`打开调试入口。

![debug配置界面](http://img14.360buyimg.com/uba/jfs/t16993/117/1581866251/184631/481bc220/5ad43f5fNe521ed0f.png)

【图1】debug配置界面

在这个界面，一般只需要修改IP，保证<b>和手机同网段</b>。

点击生成二维码，等待用测试APP扫描。

### 访问开发工程

#### 准备测试手机

安卓、iOS测试机各备一个即可，我在开发过程中也用过其他测试机，来验证某些难解决的bug是否是因为机型问题导致，但实际上，各个测试机表现都一致，问题出现在其他地方。JDReact也不像Web开发对屏幕分辨率那么敏感，依照750px设计宽进行开发，调用`JDDevice.getRpx(750宽设计稿数值)`自动生成设备相应宽度即可。

从应用商店下载的京东APP是没法进行调试的，需要下载京东的Debug客户端。

Debug客户端下载地址在京东“无线持续集成平台”上，可能需要申请下载权限。下载时，请认准包名的debug/jrdebug字样。

安卓：

安卓客户端安卓挺方便，不赘述。

安装成功后，在<b>本地调试</b>阶段，需要开启“账户设置--设置--打开jdreact调试”功能，在<b>打包测试</b>阶段，则需要关闭此功能。

iOS：

iOS需要将ipa包下载到本地然后通过iTools进行本地安装。iOS“账户设置”里没有jdreact调试选项，无需额外操作。

安装成功后，需要在iOS“设置-通用-描述文件与设备管理”中信任新装的APP。

#### 在手机上看到“Hello, yourPrjectName”

将手机和【图1】中的IP连在同一网段，用测试APP扫描“安卓/iOS跳转”下的二维码，激动人心的时刻到了，手机屏幕见红了！恭喜你，你用的是安卓机。

提示“Could not connect to development server”。

这个时候，摇一摇手机，弹出了一系列菜单选项，最下边有一行“Dev Settings”，点击进去，找到“Debug server host & port for device”，输入【图1】IP和端口，保存，reload。

成功！

## 开发及采坑

网络，JDNetwork
路由跳转
动画，能用gif就别用animation
细线条： dpx
dialog，
第三方包，转web
状态枚举
下拉刷新
顶部导航
底部导航
APP本身生命周期
样式
Windows坑，安装


## 编译打包
项目开发进度良好，我想发个包看看RN到底怎么样，毕竟在本地调试阶段，由于大量调试代码存在，速度并不是那么令人满意。

打开京东“无线持续集成平台”，构建JDReact：

![构建步骤](http://img14.360buyimg.com/uba/jfs/t19141/32/1663671643/29946/cf5383d/5ad45503N1ed59a0e.png)

CI平台将从git仓库里拉取代码构建。

注意，这个构建方式不提供构建过程log，如果总是构建失败，需要查看构建失败原因，就需要用复杂些的Jenkins构建。

Jenkins入口请联系JDReact团队，这里假设你已经进入JDReact的Jenkins平台。进入XXX.XXX.XXX.XXX:8080/jenkins/，可以看到下图：

![Jenkins面板](http://img20.360buyimg.com/uba/jfs/t17815/151/1689312135/18028/94752a3/5ad45695N038cf103.png)

打包构建的均为`_fullpack`后缀的任务，点击iOS/安卓_fullpack进入下一个页面，在这个页面中左上角找到`Build with Parameters`链接，点击后按提示操作即可。

点击`开始构建`后，Jenkins左侧面板的`Build History`会显示我们的构建进度，最终成功生成一个二维码。

在测试APP的设置中关闭“jdreact调试”功能，然后扫描构建生成的二维码，成功！页面如丝滑般流畅！太开心了！

这个二维码只要在京东内网都能访问哦，在产品和设计手机上装上京东debug APP，让他们也看看吧。

## 上线
【】占坑
