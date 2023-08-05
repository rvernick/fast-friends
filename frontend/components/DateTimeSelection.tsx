import {Platform, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WebDateTimeSelector } from './WebDateTimeSelector';
import { AndroidDateTimeSelector } from './AndroidDateTimeSelector';

export const DateTimeSelection = (props) => {
if (Platform.OS === 'android') {
  return AndroidDateTimeSelector(props);
} else if (Platform.OS === 'web') {
   return WebDateTimeSelector(props);
}

 const handleDateChange = (event, selectedDate) => {
  const currentDate = new Date(selectedDate);
  props.setter(currentDate);
};

return <div>
  <DateTimePicker
    mode="datetime"
    value={props.datetime}
    minimumDate={props.minimumDate}
    onChange={handleDateChange} />
  </div>;
};