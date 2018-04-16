# 从零经验到上线JDReact(RN)项目

## 目标
笔者在做JDReact项目之前，只有一个React项目经验(React + mobx)，而RN项目，曾数次打开RN官方文档，看着自己的Windows电脑默默的又把页面关了，因此，对于RN以及JDReact，仅停留在这是一个拥有独特标签的React库，毕竟写法还是React形式嘛，毕竟如何转Native,如何转Web，也不是现在关心的事嘛。

但在着手JDReact开发后，发现它不仅仅只是一个React库那么简单，它的周边及组件库都有很多挑战，笔者刚开始做时反复看了JDReact的官方文档多遍，也问了很多人，但毕竟刚接触RN开发，JDReact又在RN之上增加了一些京东相关的能力，混杂在一起，上手曲线挺大。

写本文的目标是让初用JDReact的用户能通过这篇文章上手JDReact。相信在上手之后，后续的开发会一坦平洋。



JDReact能够在Windows上开发iOS项目。

## 章节
#### 申请接入
占坑

#### 开发所需
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

嗯，clone到本地，npm install一下，然后在`package.json`里找找哪条命令像启动命令，就是它了！`npm start`。

实际上，你可能在npm install时就出错了，因为JDReact项目目前要依托京东的npm内部库。

##### 京东npm和yarn

京东npm地址为：http://registry.m.jd.com/，在安装依赖包前先配好registry地址吧

如果用Mac开发，可能就不需要yarn，但是用Windows，你可能会遇到`npm install`安装错误(似乎是npm在windows上的一个bug)，这时候用`yarn install`来安装能够避免这个错误。

配好registry后用`yarn install`安装试试吧。安装成功后，接着执行`npm start`吧。

1. 测试手机

安卓、iOS测试机各备一个即可，我在开发过程中也用过其他测试机，来验证某些难解决的bug是否是因为机型问题导致，但实际上，各个测试机表现都一致，问题出现在其他地方。JDReact也不像Web开发对屏幕分辨率那么敏感，依照750px设计宽进行开发，调用`JDDevice.getRpx(750宽设计稿数值)`自动生成设备相应宽度即可。

2. 调试版(Debug版)客户端

从应用商店下载的京东APP是没法进行调试的，需要下载京东的Debug客户端。

Debug客户端下载地址在京东“无线持续集成平台”上，可能需要申请下载权限。下载时，请认准包名的debug字样。

安卓：

安卓客户端可以用手机浏览器扫描二维码直接下载。

在<b>本地调试</b>阶段，

iOS：

iOS需要将ipa包下载到本地然后通过iTools进行本地安装。


3. yarn
4. 京东npm
5. 测试账号





### 开发环境，本地调试，web调试
lib-core

### 编译打包

### 上线
占坑

### 采坑
除了React组件生命周期，还需关注APP的生命周期
