# JDReact 全开发指南

如果在开发过程中遇到问题，可以直接下拉到最后查看问题汇总。

笔者曾数次打开 RN 官方文档，看着自己的 Windows 电脑默默的又把页面关了。对于 RN 以及 JDReact ，仅停留在这是一个拥有独特标签的 React 库的印象上。

在着手 JDReact 开发后，发现它不仅仅只是一个 React 库那么简单，它的周边及组件库都有很多挑战。

笔者从项目开始就认真记录了所有值得注意的地方，有些可能是坑，而有些则是 JDReact 及 RN 有别于常规Web开发特有的问题。

真心希望这篇文章能让读者在开发 JDReact 项目自始至终都能用上。

## 项目启动

有别于 RN 生成一个独立的 APP ，JDReact 生成的项目运行在京东APP内，启动流程也因此复杂一些。

### 创建项目

个人没有权限创建 JDReact 工程，请联系 JDReact 开发团队创建 git 工程。

### 启动开发环境
在申请成功后，开发人员会加入一个已初始化成功的 JDReact 项目。这个项目是可直接运行的，启动项目成功后在手机上会看到`Hello, yourPrjectName`。

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

嗯，clone 到本地，`npm install`，然后在`package.json`里找找哪条命令像启动命令，就是它了！`npm start`。

实际上，你可能在npm install时就出错了，因为JDReact项目目前要依托京东的npm内部库。

#### 京东npm和yarn

京东 npm 仓库地址为：http://registry.m.jd.com/。 推荐用`nrm`包来管理 npm 仓库地址。

若是Windows开发，`npm install or npm start`时你可能会遇到`errno 3221225477`安装错误(似乎是 npm 在 Windows 上的一个 bug )，这时候用`yarn install`来安装能够避免这个错误。

配好 registry 后用`yarn install`安装依赖包，接着执行`npm start`。

项目启动后，入口在哪呢？怎么在手机上调试呢？可利用`npm start debug`自动打开调试入口，如下图。

![debug配置界面](http://img14.360buyimg.com/uba/jfs/t16993/117/1581866251/184631/481bc220/5ad43f5fNe521ed0f.png)

图1 - debug 配置界面

在这个界面，一般只需要修改 IP，保证<b>和手机同网段</b>。

点击生成二维码扫描。

### 访问开发工程

#### 准备测试手机

安卓、 iOS 测试机各备一个即可，笔者在开发过程中也用过多种机型的测试机，来验证某些难解决的 bug 是否是因为机型问题导致，但实际上，各个测试机错误都表现一致，99%的错误都出在自身代码上。

JDReact 也不像 Web 开发对屏幕分辨率那么敏感，它依照 750px 设计宽进行开发，调用`JDDevice.getRpx(750宽设计稿数值)`自动生成设备相应宽度。

#### 准备测试软件

从应用商店下载的京东APP是没法进行调试的，需要下载京东的 Debug 客户端。

Debug 客户端下载地址在京东“无线持续集成平台”上，可能需要申请下载权限。下载时，请认准包名的`debug/jrdebug`字样。

安卓：

安卓客户端安装挺方便，下载到手机后点击安装即可，注意设置中开启信任未知来源。

安装成功后，在<b>本地调试</b>阶段，需要开启“账户设置--设置--打开jdreact调试”功能，在<b>打包测试</b>阶段，则需要关闭此功能。

iOS：

iOS 需要将 ipa 包下载到本地然后通过iTools进行本地安装。iOS “账户设置”里没有`jdreact调试`选项，无需额外操作。

安装成功后，需要在iOS“设置-通用-描述文件与设备管理”中信任新装的APP。

#### 在手机上看到“Hello, yourPrjectName”

将手机和图1中的 IP 连在同一网段，用 Debug 版本的京东APP扫描“安卓/iOS跳转”下的二维码，激动人心的时刻到了，手机屏幕见红了！恭喜你，你用的是安卓机。

此时提示“Could not connect to development server”。

这个时候，摇一摇手机，弹出了一系列菜单选项，最下边有一行“Dev Settings”，点击进去，找到“Debug server host & port for device”，输入图1 IP 和端口，保存，点击Reload。

可以在`npm start`所在的命令行窗口看到编译进度条。

成功！

## 常见开发问题及采坑

在开发过程中，不免遇到各种问题，我总结了整个开发过程中的一些问题、关键点，包含了 Native 以及转 H5 三端问题。

### Windows兼容性

Windows 下存在`npm start`或`npm run web-start`启动不起来的问题。

`npm start`启动不起来的问题，先执行`yarn clean cache`，然后`rm -rf node_modules`，再用`yarn install`安装依赖包。

`npm run web-start`启动不了的问题，先执行`yarn clean cache`，然后`rm -rf node_modules`，再用`npm install`安装依赖包。

就是这么奇妙。

### 常用包

```
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform, } from 'react-native';
import { JDImage, JDJumping, JDText, JDDevice, JDTouchableWithoutFeedback } from '@jdreact/jdreact-core-lib';
```

`@jdreact/jdreact-core-lib`是 JDReact 核心包，所有组件都在这里面，源码就处于这个目录。

### 样式

1. 利用`StyleSheet`创建样式对象，尽情使用 flex 布局。

2. 大部分情况下，用`JDDevice.getRpx()`给宽高边距赋值。目的类似写sass的px2rem，都为方便转换成各手机相应的像素值。

3. 在设计稿标注1-4个像素的情况下，使用`JDDevice.getDpx()`，因为`getRpx`函数会对计算出来的值进行取整操作，因此，计算出0.5像素会被取整到0，导致细线显示不出来。

4. 所有节点默认带有`position: 'relative'`属性，因此直接使用 left, top 属性是可以的。需要绝对定位改成`position: 'absolute'`。

5. 抛弃 CSS 样式中的继承、父子选择器思路，哪个样式属性作用于哪个组件就要写在这个组件的 style 对象里。

6. Text/JDText 组件能生效的样式不多，请不要将布局样式应用在上面，只用字体字重字号颜色之类的修饰样式。

### 路由

在入口页，引入`JDRouter`定义路由页面。
```
import { JDRouter, } from '@jdreact/jdreact-core-lib';
const { Router, Route, } = JDRouter;
import A from './A';
import B from './B';
export default class JDReactHello extends React.Component {
  render() {
    return (
      <Router initRoute={{ key: 'acomp' }}>
        <Route key="acomp" type="resetTo" component={A}/>
        <Route key="bcomp" component={B}/>
      </Router>
    );
  }
}
```

在点击A页面按钮跳转B页面时，怎么调用跳转方法呢？

首先在A页面定义`contextTypes`静态变量，用于获取 React 的 context 上下文。

```
export default class A extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
 }
```

在A页面，调用`this.context.router`可获取到router实例，调用this.context.router[`to${UpperFirstWrod(key)}`](props)进行跳转。比如跳转到B页面，则写成`this.context.router.toBcomp({})`。

所有在<Router>组件<b>里</b>的后代元素，若定义了`contextTypes`，就能获取到 router 实例。

在定义路由 key 时，将 key 统一定义，方便在其他组件中调用，也方便修改。不推荐直接使用字符串定义。

```
// 不推荐
<Route key="page" component={Page}/>

// 推荐
import { ROUTES } from '../util';
<Route key={ROUTES.PAGE} component={Page}/>
```

### 网络请求
如果看过 RN 文档，可能就会用 fetch 方法来进行网络请求，甚至会用 axios。千万别着急开发，JDReact 里，最好的请求方式是用`JDNetwork`进行网络请求。

我们的开发目标是兼容三端，fetch 和 axios 只适应 H5。

京东客户端要求所有请求都走京东网关接口，客户端也提供了专门的 SDK，如果现在的后端接口还是常规 H5 接口(ajax or jsonp)，及时联系后端提供网关接口。

网关接口response里有个<b>很重要的参数</b>`code: 0`，如果返回json根没有`code: 0`，会被 SDK 直接视为错误。

网关也支持 jsonp，需要将 jsonp 的名称改为`jsonp: 'jsonp'`。

根据环境不同京东登录态分四种：APP登录，H5登录，PC登录，微信手Q登录。需要根据环境来传递登录态标识。

建议包裹`JDNetwork`,调用自己包裹的请求方法，方便扩展。

### 动画
笔者写了一个 loading 转动的动画，测试的时候在安卓机上发现这个 loading 动画组件会阻塞他父级组件的动画，具体原因笔者没有深究，最后采用 gif 替代，因此，写动画的原则是：

能用 gif 就别用动画，动画能不嵌套就不嵌套。

### Dialog
一般点击弹出对话框的按钮处于一个较深且小的子组件中，如果是客户端，将 Dialog 写在子组件中是没什么问题的，APP 的原生机制能保证整个蒙层覆盖屏幕。

但是当转为 H5 时，就会遇到 fixed 的一个机制：当父元素带有 transform 属性时，子元素fixed定位会相对于该父元素。这个时候，子元素里的Dialog就只蒙住父元素，而不是整个屏幕，导致样式出错，因此，对于这种全局性质的组件，最好放在根节点下，利用 redux 或其他方式进行数据传递。

### 第三方组件转 H5

对于那些不支持 H5 形式的三方组件，如果用`Platform.OS`进行平台区分，转 H5 可能会有编译错误，可以利用 component.web.js，component.ios.js，component.android.js 来避免。

### APP运行状态
RN 将 APP 运行状态抽象成`active`,`background`,`inactive`三种状态，在 iOS 下，当处于非`active`状态下，`setTimeout/setInterval`会休眠，因此，在处理定时任务时，需要关注 APP 运行状态。

实际上，浏览器也有判断页面是否处于激活状态的`document.hidden`，Web页面的动画也存在休眠的情况。

### `JDScrollView`作为`FlatList`的滚动渲染组件
做商品列表，或者各种列表时会遇到下拉刷新的需求，下拉刷新统一采用京东下拉样式。因此采用`JDScrollView`作为`FlatList`的滚动渲染组件。

但是这个组件存在一个问题，当列表高度不足容器高度时，`JDScrollView`的 loading 动画区域会露出来。

![露出了loading占位区域](http://img12.360buyimg.com/uba/jfs/t18832/115/2442484073/531008/d567ada3/5af555f7N19733d9d.jpg)
 
为了解决这个问题，方法之一是通过传给`FlatList`的 data 数量，计算每个 data 的 renderItem 高度，来动态计算剩余空间，然后生成一个 空View 作为 renderItem 填充进行。

但这种方法遇到 Item 高度不定的情形计算起来非常复杂，笔者利用另一种思路来解决这个问题。

笔者解决这个问题的核心代码是：
```
<FlatList
  renderScrollComponent={(props) => (<JDScrollView {...props} />)}
  contentContainerStyle={{minHeight: this.state.tabContentHeight}}
/> 
```
利用 minHeight 强制保证`FlatList`的内容区高度和容器高度一致。现在问题转化为，如何保证`FlatList`渲染时得到容器高度`tabContentHeight`？

在 RN 中，从根节点到当前节点，如果在这条路径上的所有节点都具有`flex: 1`属性，那么，RN 就能在渲染内容区之前确定本身的高度。

利用这个信息，创建一个包裹组件，这个组件能获得他自身的高度：
```JSX
<ScrollHackWrap getAsyncHeight={(height) => { this.setState({tabContentHeight: height})}}>
  <FlatList
    renderScrollComponent={(props) => (<JDScrollView {...props} />)}
    contentContainerStyle={{minHeight: this.state.tabContentHeight}}
  />
</ScrollHackWrap>
```

获取自身高度的原理是利用 RN 的 onLayout 属性。

```JSX
// ScrollHackWrap.js
  getHeight(event) {
    let { height } = event.nativeEvent.layout;
    this.setState({
      height: height
    });
    this.props.getAsyncHeight(height + this.indicatorHeight);
  }

  render() {
    return (
      <View onLayout={(event)=>{this.getHeight(event)}} style={{flex: 1}}>
        {this.state.height > 0 && this.props.children}
      </View>
    );
  }
```

这样，无论 renderItem 最后渲染的条目总高度是否低于容器高度，都能保证正确的显示。

### 转 H5
转H5时遇到了不少样式问题，但回过头看，实际上做的改动非常少。

若是 webkit 内核的浏览器，若发现有样式缺失，将具体样式补充在`contentContainerStyle`之类里即可，这部分工作本应该是由 JDReact 团队来做的。

对于UC浏览器，核心是解决这两个问题。

1. 非 block 元素flex失效，也即inline, inline-block元素上用`display: flex`是无效的，而 RN 将 Text 之类转成了`inline-block`。

2. `space-around`不可用，这个就很没道理，但UC缺失不支持这个属性，若可行，改成`space-between`。

解决这两个问题，UC上的样式也就解决差不多了。

### 微信手Q登录

微信手Q是最令人头疼的，开代理无法进行 https 跳转，缓存页面缓存 cookie 等问题。

首先说说登录的事，前面讲到过京东登录分为4个状态，APP登录，H5登录，PC登录，微信手Q登录。

移动 Web 端主要就考虑H5登录和微信手Q登录了。

本段如果没看懂可直接跳过看下一段。如果你用了上述两种登录方式，那么就需要后端配合对这两种方式做校验。但实际上很多后端都只会校验 H5 登录，这时就会出现很奇怪的事，明明我用的是微信手Q登录方式，为什么也能获取到数据呢？原因在于之前访问过京东相关页面，并用H5方式登录过，cookie 里带有 H5 登录态相关字段，因此能校验通过。如果此时清除微信缓存，就会发现虽然登录但是数据获取不到了的奇怪现象。总之登录这一块比较复杂，不建议用多登录方式。

微信和 QQ 里是接受 H5 方式登录的，因此，只统一采用 H5 登录方式就行，微信手Q登录不用实现。

清除微信缓存的方法是退出账号重登。

### 顶部导航头

如果实现了自己的导航头，在京东APP的 WebView 内，就会出现双导航头的情况。

解决这个问题的思路是`Platform.OS === 'web' && uaType() === 'jdapp'`，根据UA来判断是否处于京东APP内。

### 入口参数

以结算页为例，结算页需要拍品的id（paimaiId）和拍品类型(publishSource)两个参数，如果是原生接收，那么就要用到openapp，构造openapp的时候可传过去。

如果是web跳原生RN，那么就需要构造&rn_paimaiId=xxx&rn_publishSource=xxxx

如果是转web，建议后端将这两个参数写在jdreact给定好的vm模板的`GLOBAL_CONFIG`对象里，然后再入口文件里读取这个全局参数即可。

小tips，像拍品id，拍品类型，拍卖状态，在整个应用里都是固定不变的，因此可以将这些状态直接写到context里，这样就省去了props传递，以及不必要的全局状态管理（能不用redux之类就不用吧）。


## 编译打包和上线
嗯~，这块就留给JDReact的官方文档吧。

## 小结
本项目没有表单相关的操作，因此，表单的问题总结不在此列，欢迎留言在开发RN/JDReact时遇到的难题和踩过的坑。同时感谢JDReact提供的良好平台。

