
# 从零经验到上线JDReact(RN)项目

## 目标
笔者在做JDReact项目之前，只有一个React项目经验(React + Mobx)，而RN项目，曾数次打开RN官方文档，看着自己的Windows电脑默默的又把页面关了，因此，对于RN以及JDReact，仅停留在这是一个拥有独特标签的React库，毕竟写法还是React形式嘛，毕竟如何转Native,如何转Web，也不是现在关心的事嘛。

在着手JDReact开发后，发现它不仅仅只是一个React库那么简单，它的周边及组件库都有很多挑战，笔者刚开始做时反复看了JDReact的官方文档多遍，也问了很多人，但毕竟刚接触RN开发，JDReact又在RN之上增加了一些京东相关的能力，混杂在一起，上手曲线挺大。

写本文的目标是让初用JDReact的用户能通过这篇文章上手JDReact。相信在上手之后，后续的开发会一坦平洋。

## Hello World
### 申请接入
请联系JDReact开发团队创建项目git工程。

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

用Windows，`npm install or npm start`时你可能会遇到`errno 3221225477`安装错误(似乎是npm在windows上的一个bug)，这时候用`yarn install`来安装能够避免这个错误。

配好registry后用`yarn install`安装依赖包，接着执行`npm start`。

项目启动后，入口在哪呢？怎么在手机上调试呢？可利用`npm start debug`打开调试入口。

![debug配置界面](http://img14.360buyimg.com/uba/jfs/t16993/117/1581866251/184631/481bc220/5ad43f5fNe521ed0f.png)

【图1】debug配置界面

在这个界面，一般只需要修改IP，保证<b>和手机同网段</b>。

点击生成二维码扫描。

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

## 常见开发问题及采坑

在开发过程中，不免遇到各种问题，我总结了开发过程中的一些问题、关键点。

### Windows兼容性
Windows下存在`npm start`或`npm run web-start`启动不起来的问题。

`npm start`启动不起来的问题，先执行`yarn clean cache`，然后手工删除工程下的node_modules，再用`yarn install`安装依赖包。

`npm run web-start`启动不了的问题，先执行`yarn clean cache`，然后手工删除工程下的node_modules，再用`npm install`安装依赖包。

就是这么奇妙。

### 常用包
```
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform, } from 'react-native';
import { JDImage, JDJumping, JDText, JDDevice, JDTouchableWithoutFeedback } from '@jdreact/jdreact-core-lib';
```
`@jdreact/jdreact-core-lib`是JDReact核心包，所有组件都在这里面，源码就处于这个目录。

### 样式
1. 利用`StyleSheet`创建样式对象，布请尽情使用flex布局。

2. 大部分情况下，用`JDDevice.getRpx()`给宽高边距赋值。目的类似写sass的px2rem，都为方便转换成各手机相应的像素值。

3. 在设计稿标注1-4个像素的情况下，使用`JDDevice.getDpx()`，因为`getRpx`函数会对计算出来的值进行取整操作，因此，计算出0.5像素会被取整到0，导致细线显示不出来。

4. 所有节点默认带有`position: 'relative'`属性，因此直接使用left,top属性是可以的。需要绝对定位改成`position: 'absolute'`。

5. 抛弃CSS样式中的继承、父子选择器思路，哪个样式属性作用于哪个组件就要写在这个组件的style对象里。

6. Text/JDText组件能生效的样式不多，请不要将布局样式应用在上面，只用字体字重字号颜色之类的修饰样式。

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

首先在A页面定义contextTypes静态变量，用于获取React的context上下文。
```
export default class A extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
 }
```

`this.context.router`即为我们获取到router实例，调用this.context.router[`to${UpperFirstWrod(key)}`](props)进行跳转，比如跳转到B页面，则写成`this.context.router.toBcomp({})`。

所有在<Router>组件<b>里</b>的后代元素，若定义了`contextTypes`，则能获取到router实例。

在定义路由key时，将key统一定义，方便在其他组件中调用，也方便修改。不推荐直接使用字符串定义。

```
// 不推荐
<Route key="page" component={Page}/>

// 推荐
import { ROUTES } from '../util';
<Route key={ROUTES.PAGE} component={Page}/>
```

### 网络请求
如果看过RN文档，可能就会用fetch方法来进行网络请求，甚至会用axios。千万别着急开发，JDReact里，最好的请求方式是用`JDNetwork`进行网络请求。

我们的开发目标是兼容三端，fetch和axios只适应H5。

京东客户端要求所有请求都走京东网关接口，客户端也提供了专门的SDK，如果现在的后端接口还是常规H5接口(ajax or jsonp)，及时联系后端提供网关接口。

网关接口response里有个<b>很重要的参数</b>`code: 0`，如果返回json根没有`code: 0`，会被SDK直接视为错误。

网关也支持jsonp，需要将jsonp的名称改为`jsonp: 'jsonp'`。

根据环境不同京东登录态分四种：APP登录，H5登录，PC登录，微信手Q登录。需要根据环境来传递登录态标识。

建议包裹`JDNetwork`,调用自己包裹的请求方法，方便扩展。

### 动画
笔者写了一个loading转动的动画，测试的时候在安卓机上发现这个loading动画组件会阻塞他父级组件的动画，具体原因笔者没有深究，最后采用gif替代，因此，写动画的原则是：

能用gif就别用动画，动画能不嵌套就不嵌套。

### Dialog
一般点击弹出对话框的按钮处于一个较深且小的子组件中，如果是客户端，将Dialog写在子组件中是没什么问题的，APP的原生机制能保证整个蒙层覆盖屏幕。

但是当转为H5时，就会遇到fixed的一个机制：当父元素带有transform属性时，子元素absolute,fixed会相对于该父元素。

这个时候，子元素里的Dialog就会蒙住这个父元素，而不是整个屏幕，导致样式出错，因此，对于这种全局性质的组件，最好放在根节点下，利用redux或其他方式进行数据传递。

### 第三方包转H5
对于那些不支持H5形式的包，如果用Platform.OS进行平台区分，转H5可能会有编译错误，可以利用component.web.js，component.ios.js，component.android.js来避免。

### APP运行状态
RN将APP运行状态抽象成`active`,`background`,`inactive`三种状态，在iOS下，当处于非active状态下，setTimeout/setInterval会休眠，因此，在处理定时任务时，需要关注APP运行状态。实际上，浏览器也有判断页面是否处于激活状态的`document.hidden`，web页面的动画也存在休眠的情况。

### JDScrollView作为FlatList的滚动渲染组件
做商品列表，或者各种列表时会遇到下拉刷新的需求，下拉刷新统一采用京东下拉样式。因此采用JDScrollView作为FlatList的滚动渲染组件。

但是这个组件存在一个问题，当列表高度不足容器高度时，JDScrollView的loading动画区域会露出来。

![露出了loading占位区域](http://img12.360buyimg.com/uba/jfs/t18832/115/2442484073/531008/d567ada3/5af555f7N19733d9d.jpg)

为了解决这个问题，可以通过传给FlatList的data数量，以及每个data的renderItem高度，来动态计算剩余空间，然后生成一个空View作为renderItem填充进行。

但这种方法遇到Item高度不定的情形计算起来非常复杂，笔者利用另一种思路来解决这个问题。

笔者解决这个问题的核心代码是：
```
<FlatList
  renderScrollComponent={(props) => (<JDScrollView {...props} />)}
  contentContainerStyle={{minHeight: this.state.tabContentHeight}}
/> 
```
利用minHeight强制保证FlatList的内容区高度和容器高度一致。现在问题转化为，如何保证FlatList渲染时得到容器高度`tabContentHeight`？

在RN中，从根节点到当前节点，如果在这条路径上的所有节点都具有`flex: 1`属性，那么，RN就能在渲染内容区之前确定本身的高度。

利用这个信息，创建一个包裹组件，这个组件能获得他自身的高度：
```JSX
<ScrollHackWrap getAsyncHeight={(height) => { this.setState({tabContentHeight: height})}}>
  <FlatList
    renderScrollComponent={(props) => (<JDScrollView {...props} />)}
    contentContainerStyle={{minHeight: this.state.tabContentHeight}}
  />
</ScrollHackWrap>
```

获取自身高度的原理是利用RN的onLayout属性。

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

这样，无论renderItem最后渲染的条目总高度是否低于容器高度，都能保证正确的显示。

## 编译打包和上线
嗯~，这块就留给JDReact的官方文档吧。

