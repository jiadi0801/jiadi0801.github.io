# TouchableWithoutFeedback 组件包裹自定义组件的问题

声明：文中代码并没有经过编译验证，有可能存在语法错误，大家理解意思就好。

当有一个可点击列表、一个自己写的radio group、一个仿select下拉组件时，每个item其实只是一个状态展示，因此可以抽离成一个UI无状态组件。

以一个list为例，可能写出来的代码是这样子的：
```jsx
<View style={styles.ulWrap}>
  {
    list.map(item => {
      <TouchableWithoutFeedback onPress={()=>{this.doSomething()}}>
        <LiUI info={item} />
      </TouchableWithoutFeedback>
    });
  }
</View>

// LiUI
<View style={styles.LiWrap}>
  <Text>复杂的UI</Text>
</View>
```
这样写的好处是，<LiUI />纯粹是一个UI展示组件，如果不涉及UI改动，在完善`doSomething`代码时完全不用进入<LiUI/>里查看是否有需要编写的逻辑功能。

但是，当你重构代码成这样，会发现点击时onPress事件不触发了。

如果将`<LiUI />`包裹成`<View><LiUI /></View>`，又能触发，给人感觉就是只有原生组件才能使Touchable组件生效。

Google之，得到答案[https://github.com/facebook/react-native/issues/1352](https://github.com/facebook/react-native/issues/1352)

原来，`TouchableWithoutFeedback`会给他的唯一子元素传递`responder props`，如果子元素没有将传递的属性绑定在根节点上，那么是无法响应的。

可以这么理解，`TouchableWithoutFeedback`只是一个容器组件（在开发过程中应该可以明显感觉到，因为它并没有产生node节点），如果子组件不对容器组件传递的`responder props`做某些绑定，那么就无法关联子组件和容器组件，子组件的一些事件响应就无法通知到容器组件了。

解决办法就是，将props传递的属性挂到根节点上，注意先后顺序：
```JSX
// LiUI，props是函数式写法的传参，是es6写法的this.props
<View {...props} style={styles.LiWrap}>
  <Text>复杂的UI</Text>
</View>
```

这就让我想到在查阅JDReact源码时那一堆堆`{...this.props}`，之前想的是这么写只是继承原生组件的属性，现在想想其实还有更深一层的功能。

附`<JDText>`render源码：
```JSX
render(){
  return <Text allowFontScaling={false} {...this.props} style={this.getTextStyle()} />
}
```
