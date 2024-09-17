import { StyleSheet } from "react-native";

export function createStyles(width: number, height: number) {

  console.log(`Creating styles for width: ${width}, height: ${height}`);
  return StyleSheet.create({
    containerScreen: {
      position: 'absolute',
      top: 1,
      left: 1,
      width: width ,
      height: height,
    },
    containerOneBottom: {
    position: 'absolute',
      top: 1,
      left: 1,
      width: width,
      height: height-75,
    },
    containerBody: {
      flex: 1,
      top: 5,
      left: 1,
      bottom: 575,
      
    },
  containerThreeBottom: {
    flex: 1,
    paddingBottom: 125,
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
  },
  button: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  thirdButton: {
    position: 'absolute',
    bottom: 64,
    left: 16,
    right: 16,
  },
  upperButton: {
    position: 'absolute',
    bottom: 64,
    left: 16,
    right: 16,
  },
  bottomButton: {
    position: 'absolute',
    top: height-225,
    left: 16,
    right: 16,
  },
  text: {
    fontSize: 42,
  },
  });

};

export const styles = StyleSheet.create({
  containerScreen: {
    position: 'relative',
    marginBottom: 0,
  },
  containerOneBottom: {
    flex: 1,
    paddingBottom: 75,
  },
  containerBody: {
      flex: 1,
      top: 1,
      left: 1,
      bottom: 10,
    },
  containerThreeBottom: {
    flex: 1,
    paddingBottom: 125,
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
  },
  button: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  thirdButton: {
    position: 'absolute',
    bottom: 64,
    left: 16,
    right: 16,
  },
  upperButton: {
    position: 'absolute',
    bottom: 64,
    left: 16,
    right: 16,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  text: {
    fontSize: 42,
  },
});
