import {
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';

const background = '#5cbbff';
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const STATUS_HEIGHT = StatusBar.currentHeight;
const NAVBAR_HEIGHT = DEVICE_HEIGHT - WINDOW_HEIGHT;

let spinValue = new Animated.Value(0);

// First set up animation
Animated.loop(
  Animated.timing(spinValue, {
    toValue: 1,
    duration: 800,
    easing: Easing.linear,
    useNativeDriver: true,
  }),
).start();

// Next, interpolate beginning and end values (in this case 0 and 1)
const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

export const styles = StyleSheet.create({
  fundo: {
    backgroundColor: background,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    paddingTop: STATUS_HEIGHT,
  },
  searchIcon: {
    resizeMode: 'stretch',
    width: 22,
    height: 22,
    marginRight: 20,
  },
  image: {
    justifyContent: 'center',
    marginTop: 5,
    resizeMode: 'stretch',
    width: 90,
    height: 90,
  },
  fonteBig: {
    marginTop: 0,
    marginBottom: 5,
    color: '#777',
    fontSize: 28,
    textAlign: 'center',
  },
  fontNormal: {
    fontSize: 16,
    color: '#444444',
  },
  centerBox: {
    backgroundColor: '#fff',
    width: '90%',
    height: '75%',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
  },
  location: {
    marginTop: '5%',
    marginBottom: '6%',
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  week: {
    borderRadius: 50,
    width: '100%',
    marginTop: 15,
    marginBottom: 20,
  },
  imgWeek: {
    resizeMode: 'stretch',
    width: 50,
    height: 50,
  },
  weekView: {
    backgroundColor: '#E5E5E5',
    marginBottom: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
  },
  search: {
    color: '#444444',
    fontSize: 20,
    width: '90%',
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  weekContents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingBox: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
  },
  loadIcon: {
    width: 40,
    height: 40,
    transform: [{rotate: spin}],
  },
});
