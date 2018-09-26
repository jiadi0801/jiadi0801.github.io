import {PanResponder, AppState} from 'react-native';
export default class CatchResponder {
  constructor() {
    // 处于被劫持状态，被子组件劫持，或者被虚空劫持
    this._captured = true;
    // 处于侧滑状态？ 0 - 未判定  1 - 判定生效  2 - 判定失效
    this._sliding = 0;

    // 一定要在页面销毁前注销事件，不然会引起内存泄露
    this._moveQueue = [];
    this._releaseQueue = [];

    this._cbResolve = this._cbResolve.bind(this);
    this._cbReject = this._cbReject.bind(this);
  }

  /**
   * 侧滑中
   */
  _Sliding(gestureState) {
    this._moveQueue.forEach(cb => {
      cb(gestureState);
    });
  }

  /**
   * 释放手势, TODO app状态发生改变时，比如按了home键，比如来电打断等，这些都需要触发release
   */
  _Release(gestureState) {
    this._reset();
    this._releaseQueue.forEach(cb => {
      cb(gestureState);
    });
  }

  _reset() {
    this._captured = true;
    this._sliding = 0;
  }

  _cbResolve() {
    console.log('侧滑判定有效')
    this._captured = false;
    this._sliding = 1;
  }
  _cbReject() {
    console.log('侧滑判定无效')
    this._captured = true;  // 被虚空所劫持
    this._sliding = 2;
  }

  /**
   * 判定此次move是否能触发侧滑
   * 可重写次方法来设定判定模式
   * @override
   * @param {*} gestureState Move手势状态
   * @param {*} cbResolve 成功请调用，不确定是否触发侧滑可以不调用这两个cb方法
   * @param {*} cbReject  失效请调用
   */
  judgeSlideAction(gestureState, cbResolve, cbReject) {
    // 已经被判定过，不在进行判定
    if (this._sliding !== 0) return;

    const dx = Math.abs(gestureState.dx);
    const dy = Math.abs(gestureState.dy);
    // 水平或者垂直移动距离超过min， 开始进行判定
    const angle = 0.5, min = 5;
    if (dx >= min || dy >= min) {
      if (dx > 0 && dy / dx < angle) {
        cbResolve();
      } else {
        cbReject();
      }
    }
  }

  /**
   *
   * @param {string} type  可选move|release
   * @param {function} cb  回调函数将会传递手势对象cb(gestureState)
   * @return {object} {off:function} 返回一个带off方法的对象
   */
  on(type = '', cb) {
    if (type !== 'move' && type !== 'release') {
      return {off: () => {}}
    }
    if (typeof cb !== 'function') {
      return {off: () => {}}
    }

    this[`_${type}Queue`].push(cb);
    const me = this;
    return {
      off: () => {
        me._moveQueue = me._moveQueue.filter(item => item !== cb)
      }
    }
  }

  /**
   * 可选 move, release，不填两者全销毁
   * @param {*} type
   */
  off(type) {
    if (type === 'move') {
      this._moveQueue = [];
    } else if (type === 'release') {
      this._releaseQueue = [];
    } else {
      this._moveQueue = [];
      this._releaseQueue = [];
    }
  }

  getChildPanResponder() {
    return PanResponder.create({
      // 侧滑 && 子元素没有劫持 -> 成为响应者
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // console.log('child move')
        this._sliding = 2;
        return false;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onPanResponderReject: () => {},
      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: (evt, gestureState) => {},
      onPanResponderEnd: () => {},
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {},
      onPanResponderTerminate: (evt, gestureState) => {},
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  }

  getParentPanResponder() {
    return PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        this._reset();
        return false;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // console.log('should');
        this.judgeSlideAction(gestureState, this._cbResolve, this._cbReject);
        return !this._captured;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        // console.log('capture moving');
        this._Sliding(gestureState);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。

        // may侧滑停止
        this._Release(gestureState);
        // console.log('release')
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。

        // may侧滑结束
        // console.log('termi')
        this._Release(gestureState);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  }
}