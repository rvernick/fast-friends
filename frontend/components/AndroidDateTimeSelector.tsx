import { useState } from "react";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateAndTimeController from './DateAndTimeController';
import { View } from "react-native";

export const AndroidDateTimeSelector = (props) => {
  const initDate = new Date(props.value);
  const [date, setDate] = useState(initDate);
  const [time, setTime] = useState(initDate);

  const controller = new DateAndTimeController(date, props.setter);

  const handleDateChange = (event: DateTimePickerEvent, selecteDate: Date) => {
    const {
      type,
      nativeEvent: {timestamp},
    } = event;
    console.log(type);
    console.log(selecteDate);
    console.log(timestamp);
    if (type === 'set') {
      controller.setDate(selecteDate);
      setDate(controller.getDate());
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime: Date) => {
    const {
      type,
      nativeEvent: {timestamp},
    } = event;
    console.log('timechange: ' + type);
    console.log('timestame ' + timestamp);
    console.log('selectedTime: ' + selectedTime);
    if (type === 'set') {
      controller.setTime(selectedTime);
      setDate(controller.getDate());
    }
  };

  return <View>
    <DateTimePicker
      mode="date"
      value={date}

      minimumDate={props.minimumDate}
      onChange={handleDateChange} />
    <DateTimePicker
      mode="time"
      minuteInterval={5}
      value={time}
      minimumDate={props.minimumDate}
      onChange={handleTimeChange} />
  </View>
};