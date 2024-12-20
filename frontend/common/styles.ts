import { StyleSheet } from "react-native";

export const tabBarIconSize = 24;

export function createStyles(width: number, height: number) {

  const tenth = Math.round(0.1*height);
  const third = Math.round(0.3*height);
  const twoThirds = Math.round(0.7*height);

  return StyleSheet.create({
    containerScreen: {
      position: 'absolute',
      top: 1,
      left: 1,
      width: width ,
      height: height,
      justifyContent: "space-between",
      alignItems: "stretch",
    },
    containerCentered: {
      position: 'absolute',
      top: 1,
      left: 1,
      width: width ,
      height: height,
      justifyContent: "center",
      alignItems: "center",
    },
    topThird: {
      position: 'absolute',
      top: tenth,
      left: 1,
      width: width-1,
      height: height-third,
      justifyContent: "center",
      alignItems: "center",
    },
    centerScreen: {
      position: 'absolute',
      top: third,
      bottom: height-25,
      left: 1,
      right: width-1,
      justifyContent: "center",
      alignItems: "center",
    },
    containerOneBottom: {
    position: 'absolute',
      top: 1,
      left: 1,
      width: width,
      height: height-75,
    },
    containerBodyFull: {
      flex: 1,
      top: 5,
      left: 1,
      right: width-1,
      marginBottom: 150,
    },
    containerBody: {
      flex: 1,
      top: 5,
      left: 1,
      right: width-1,
      marginBottom: 225,
    },
    container: {
      flex: 1,
      // paddingTop: StatusBar.currentHeight,
    },
    input: {
      margin: 4,
    },
    scrollView: {
      flex: 1,
      marginHorizontal: 8,
      marginBottom: 225,
    },
    topButtons: {
      margin: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bottomButtons: {
      position: 'absolute',
      top: height-220,
      left: 2,
      right: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bottomButton: {
      position: 'absolute',
      bottom: 230,
      // top: height-225,
      flexDirection: 'row',
      left: 16,
      right: 16,
    },
    text: {
      fontSize: 42,
    },
  });
};

export const defaultWebStyles = StyleSheet.create({
  containerScreen: {
    flex: 1,
    marginBottom: 0,
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  containerCentered: {
    flex: 1,
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  topThird: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  centerScreen: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  containerOneBottom: {
    flex: 1,
    paddingBottom: 75,
  },
  containerBodyFull: {
      flex: 1,
      top: 5,
      left: 1,
      marginBottom: 5,
  },
  containerBody: {
      flex: 1,
      top: 5,
      left: 1,
      marginBottom: 75,
    },
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
  },
  input: {
    margin: 4,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 75,
  },
  topButtons: {
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 42,
  },
});
