import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  View,
  Easing,
  Animated
} from 'react-native';
import SceneComponent from './SceneComponent';
import Device from './Device';
import CatchResponder from './CatchResponder';

const _responder = new CatchResponder();

export {_responder as responder};

export default class ViewPager extends Component {
  static propTypes = {
    // 初始展示页
    initPage: PropTypes.number,
    // page宽度
    width: PropTypes.number,
    // 内容包裹框样式
    contentContainerStyle: PropTypes.object,
    // 动画时长
    duration: PropTypes.number,
    // 侧滑到当前页面完成
    onPageSelected: PropTypes.func,
    // 侧滑过程中
    onScroll: PropTypes.func,
    // 手势响应CatchResponder对象
    responder: PropTypes.instanceOf(CatchResponder),

    children: PropTypes.node,   // TODO 校验子节点带有tabLabel
  }

  static defaultProps = {
    initPage: 0,
    width: Device.getRpx(750),
    contentContainerStyle: {},
    duration: 300,
    responder: _responder,
    onPageSelected: () => {},
    onScroll: () => {}
  }

  constructor(props) {
    super();
    this.state = {
      // 页面总数，不支持动态渲染page个数
      pageNum: props.children.length,
      // 当前展示页面
      currentPage: props.initPage,
      // 侧滑移动差
      offsetX: 0,

      // 场景页面的缓存值，包括动态渲染时剔除不存在的
      sceneKeys: []
    }

    this.pageValue = new Animated.Value(props.initPage);


    this._panResponder = props.responder.getParentPanResponder();
    this._sliding = this._sliding.bind(this);
    this._release = this._release.bind(this);
    props.responder.on('move', this._sliding);
    props.responder.on('release', this._release);
  }

  componentDidMount() {
    this.updateSceneKeys({
      page: this.state.currentPage
    });
  }

  _sliding(gestureState) {
    this.setState({
      offsetX: gestureState.dx
    });

    const {currentPage} = this.state;
    const {width} = this.props;

    let pos = currentPage - gestureState.dx / width;

    this.pageValue.setValue(pos);
  }

  _release(gestureState) {
    const {offsetX, currentPage, pageNum} = this.state;
    const {width} = this.props;

    const theta = 350;  // 手感
    const s = Device.getRpx(Math.pow(Math.abs(gestureState.vx), 4/3) * theta);

    const offsetTrend = offsetX > 0 ? (offsetX + s) : offsetX < 0 ? (offsetX - s) : 0;
    let delta = offsetTrend / width; // move移动偏移比

    let targetPage = currentPage;
    if (delta < -0.5) {
      targetPage = currentPage + 1;
    } else if (delta > 0.5) {
      targetPage = currentPage - 1;
    }
    this.setState({
      offsetX: 0
    });
    if (targetPage < 0) {
      targetPage = 0;
    }
    if (targetPage >= pageNum) {
      targetPage = pageNum - 1;
    }
    this._goToPage(targetPage);
  }

  /**
   * 跳转页面
   * @param {*} page
   */
  goToPage(page) {
    this._animateToPage(page, ({finished}) => {
      finished && this.updateSceneKeys({page});
    });
  }

  _goToPage(page) {
    this._animateToPage(page, ({finished}) => {
      this.updateSceneKeys({page});
      finished && this.props.onPageSelected(page);
    });
  }

  _animateToPage(page, callback = () => {}) {
    Animated.timing(
      this.pageValue,
      {
        toValue: page,
        duration: this.props.duration,
        easing: Easing.easeOut
      }
    ).start(callback);
  }

  _children(children = this.props.children) {
    return React.Children.map(children, (child) => child);
  }

  _keyExists(sceneKeys, key) {
    return !!sceneKeys.find((sceneKey) => key === sceneKey);
  }

  /**
   * 同时设置page和更新场景key缓存
   * @param {*} param0
   */
  updateSceneKeys({page, children = this.props.children, callback = () => {}}) {
    const oldKeys = this.state.sceneKeys;
    const newKeys = [];
    this._children(children).map((child, index) => {
      const key = child.props.tabLabel;
      if (page === index
        || this._keyExists(oldKeys, key)
      ) {
        newKeys.push(key);
      }
    });
    this.setState({
      currentPage: page,
      sceneKeys: newKeys
    }, callback);
  }


  /**
   * 渲染每个page，有些page如果不在视图中则return 空View
   * ---------
   * | x | x |
   * | x | x |
   * ---------
   */
  _composeScenes() {
    return this._children().map((child, idx) => {
      let key = child.props.tabLabel;
      return (
        <SceneComponent
          key={key}
          shouldUpdated={this.state.currentPage === idx}
          style={{width: this.props.width}}
          tabSelected={this.state.currentPage === idx}
        >
          {
            this._keyExists(this.state.sceneKeys, key)
            ? child
            : <View tabLabel={key} />
          }
        </SceneComponent>
      );

    });
  }

  render() {
    const {width} = this.props;
    const {pageNum} = this.state;

    const animStyle = {
      flexDirection: 'row',
      flex: 1,
      width: pageNum * width,
      transform: [{translateX: this.pageValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -width]
      })}]
    }

    return (
      <View {...this._panResponder.panHandlers} style={[styles.container, this.props.contentContainerStyle, {width: width}]}>
        <Animated.View style={animStyle}>
          {this._composeScenes()}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  }
});