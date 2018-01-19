# Rxjs

## WTF
```JS
var observable = Rx.Observable.from([10, 20, 30]);
var subscription = observable.subscribe(x => console.log(x));
```
完全看不明白啊~

## 开始学习文档
`Think of RxJS as Lodash for events.`, lodash是js常用操作的工具库，像lodash一样的事件工具库该怎么理解啊？没有一点联系上的感觉。

事件不是on,off,trigger嘛？
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

console.log('just before subscribe');
observable.subscribe({
  next: x => console.log('got value ' + x),
  error: err => console.error('something wrong occurred: ' + err),
  complete: () => console.log('done'),
});
console.log('just after subscribe');
```

上边这段`next`，嗯~~ 连续trigger，容易理解。setTimeout里面`next`，异步执行，容易理解。

`Observables are able to deliver values either synchronously or asynchronously.` 理解了，event就是这么个机制。

### 和事件不相同的地方
```JS
var foo = Rx.Observable.create(function subscribe(observer) {
    console.log('Hello');
    observer.next(42);
  });
  
  foo.subscribe(function (x) {
    console.log(x);
  });
  foo.subscribe(function (y) {
    console.log(y + 1);
  });
```
subscribe不同于event on，on注册该回调，当事件触发时，所有注册的回调都会执行，而subscribe则是在执行foo.subscribe方法时调用了create里边的回调，两个subscribe是分别执行了create里的回调。

订阅发布模式有两种情况，第一种，发布者推送，所有订阅者收到广播，订阅者执行回调。第二种，订阅者拉取，拉取时发布者执行回调。(当然，如果发布者在他的回调中异步执行next,那么订阅者就会异步响应。这块不是很好理解。

第一种对应传统event，第二种就对应subscribe。

### subscribe的理解
```JS
function subscribe(observer) {
  var intervalID = setInterval(() => {
    observer.next('hi');
  }, 1000);

  return function unsubscribe() {
    clearInterval(intervalID);
  };
}

var unsubscribe = subscribe({next: (x) => console.log(x)});

// Later:
unsubscribe(); // dispose the resources
```

### 回看event中的lodash
在上边的例子中，经常变动的代码以及耦合严重的代码都处于create函数的回调中。

比如，在create的回调中注册了click，每次click后执行next，引起observable.subscribe里回调执行。

比如，我又有一个click事件，同样在click后执行next。还有其他各种各样的事件。

这样写起来还是挺麻烦的，这种常见麻烦是不是和isArray一样可以封装起来呢？ 如果Rxjs干的就是将这些常见的event麻烦（限流，去抖，计数）封装起来，那它不就是event的lodash了吗？！

## 以上思考记于看完Observable,Observer的概念，尚未接触Rxjs那些类lodash函数
因此，对于下面的这段代码，无法理解每个函数的执行过程，以及无法建立一个灵活使用Rxjs的概念。
```JS
const EE = require('events').EventEmitter;
const Rx = require('rxjs/Rx');
let ee = new EE();
Rx.Observable.fromEvent(ee, 'click')
    .throttleTime(500)
    .scan(count => count + 1, 0)
    .subscribe(count => {
    console.log('clicked ' + count + ' times');
});

setTimeout(() => {
    console.log(`I'll click the button`);
    ee.emit('click');
    ee.emit('click');
    ee.emit('click');
    setTimeout(() => {
        ee.emit('click');
    }, 600);
}, 100);
```
但是大概能理解文首的`Rx.Observable.from([10, 20, 30]);`了

