import { React, StyleSheet, StatusBar, Dimensions } from 'react-native'

const background = "#5cbbff"
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const STATUS_HEIGHT = StatusBar.currentHeight
const NAVBAR_HEIGHT = DEVICE_HEIGHT - WINDOW_HEIGHT


export const styles = StyleSheet.create({
  fundo: {
    backgroundColor: background,
    height: "100%",
    width: "100%",
    alignItems: "center",
    paddingTop: STATUS_HEIGHT
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
    color: "#777",
    fontSize: 28,
    textAlign: 'center',
  },
  fontNormal: {
    fontSize: 15,
    color: "#444444"
  },
  centerBox: {
    backgroundColor: "#fff",
    width: "90%",
    height: 580,
    borderRadius: 20,
    display: "flex",
    alignItems: "center"
  },
  location: {
    marginTop: 30,
    marginBottom: 30,
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  week: {
    borderRadius: 50,
    width: "100%",
    marginTop: 15,
    marginBottom: 20,
  },
  imgWeek: {
    resizeMode: 'stretch',
    width: 50,
    height: 50
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
    color: "#444444",
    fontSize: 20,
    width: "90%",
    borderRadius: 10,
    paddingHorizontal: 20
  },
  weekContents: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});