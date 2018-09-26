/**
 * 基于750屏幕宽度(iphone6)，按比例转换px
 */
import {
  Platform,
  PixelRatio,
  Dimensions,
} from 'react-native';

const dpr = parseInt(PixelRatio.get(), 10) || 1;
let { width, height } = Dimensions.get('window');
if (Platform.OS === 'android') {
  if (width > height) {
    width = Dimensions.get('window').height;
    height = Dimensions.get('window').width;
  }
}
const ratioDeps750 = width / 750;

export default {
  width,
  height,
  dpr,
  getRpx(value) {
    return Math.floor(value * ratioDeps750);
  },
  getDpx(value) {
    return value / this.dpr;
  },
};