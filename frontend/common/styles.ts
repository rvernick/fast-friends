import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerOneBottom: {
    flex: 1,
    paddingBottom: 75,
  },
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
  },
  input: {
    margin: 16,
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
  text: {
    fontSize: 42,
  },
});
