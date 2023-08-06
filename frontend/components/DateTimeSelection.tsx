import {Platform, StyleSheet} from 'react-native';
import { WebDateTimeSelector } from './WebDateTimeSelector';
import { AndroidDateTimeSelector } from './AndroidDateTimeSelector';
import { IOSDateTimeSelector } from "./IOSDateTimeSelector";

export const DateTimeSelection = (props) => {

  if (Platform.OS === 'android') {
    return AndroidDateTimeSelector(props);
  } else if (Platform.OS === 'web') {
    return WebDateTimeSelector(props);
  }

  return IOSDateTimeSelector(props);
};
