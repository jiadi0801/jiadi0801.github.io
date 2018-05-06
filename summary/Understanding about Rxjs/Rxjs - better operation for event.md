# Rxjs
## 更好的事件管理

JDC-刘佳

<small>2018.05</small>



## 常规事件


* 同步事件
* 基于on-emit模式
* DOM事件
* 自定义on-emit事件
* 一些示例


### 同步事件
``` js 
var a = 1;
```


### on-emit：解耦


### on-emit模式 - DOM事件

<small>on将回调函数放入事件响应队列中，emit触发执行队列中每个函数。</small>

```js
    btn.click(function (e) {
        // DO SOMETHING
    });
```


### on-emit模式 - 自定义

``` js
    // 定义一个简单的事件触发器 util.js
    var EventEmitter = function () {
        this.typeMap = {};
    }
    EventEmitter.prototype.on = function (type, callback) {
        if (!this.typeMap[type]) {
            this.typeMap[type] = [];
        }
        this.typeMap[type].push(callback);
    }
    EventEmitter.prototype.emit = function (type, data) {
        let cbList = this.typeMap[type] || [];
        cbList.map(cb => {
            cb({data: data});
        });
    }
    EventEmitter.prototype.off = function () {}

    var ee = new EventEmitter(); // export出去
```



### 一个常见的事件处理

[example 4: 实时搜索](/ld/demo/html/index.html)


### 更多形态的事件
* 路由跳转
* 链式请求 a -> b -> c
* drag
* 双击
* ...



### 如何面对这形态各异的事件？

事件源：鼠标，滚轮，网络请求，过滤...

事件行为：主动拉取，被动推送



### 事件中的lodash

> Rxjs官网：可以把 RxJS 当做是用来处理事件的 Lodash

<small>类似jQuery的isArray, isEmptyObject, trim, merge之类的工具方法</small>

<small>Rxjs则是提供一套事件工具方法，让我们以统一的方式处理各种事件</small>




### Rxjs相关概念

* 订阅发布模式
* Observable
* 操作符


#### 订阅发布模式

* on-emit
* redux
* mobx

前端大部分库核心都是订阅发布模式


#### Observable

Rxjs的核心

Observable是一个发布对象

<small>事件流指的就是从一个Observable生成另一个Observable，通过链式调用的方式实现流式处理</small>

<small>无论是promise，DOM事件，或者ajax，都能封装成一个observable对象</small>


```JS
var observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 1000);
});

observable.subscribe(number => {
    console.log(number);
});
```


#### 操作符

抽出常见的事件处理模式封装成一个操作符

操作符在使用上很相似

<small>concat, merge, mergeMap, from, debounce, scan...</small>



### 来把前边的例子用Rxjs实现一遍

[examples](/ld/demo/html/index-rxjs.html)


### 自定义操作符



### Rxjs和on-emit的不同

Rxjs靠订阅者拉取数据，无论在什么时候`.subscribe`，发布者发出的值依旧能被订阅者接收到。

on-emit由发布者广播数据，`.on`注册的订阅者只能收到最新的数据。



### 利用Promise来理解Observable

Observable是多维的Promise

`map`是一维的，和我们理解的map是一样的

```
  ---1-----2--3---|
     \     \   \        此处就是map的回调函数，return的是一个值
      a     b   c 
  ↓ map
  ---a-----b--c--|
```

`mergeMap`是二维的

```
  ---1-----2--3---|
     \     \   \        此处是mergeMap的回调函数
      \     b   d       return的是一个异步的Observable
       a     \
              c
  ↓ mergeMap
  ---a-----b-d--c--|
```



### Thanks
