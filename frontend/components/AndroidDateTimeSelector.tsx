import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import DateAndTimeController from './DateAndTimeController';

export const AndroidDateTimeSelector = (props) => {
  const [date, setDate] = useState(props.datetime);
  const [time, setTime] = useState(props.datetime);

  const controller = new DateAndTimeController(props.datetime, props.setter);

  const handleDateChange = (event) => {
    controller.setDate(event.detail.value);
  }
  const handleTimeChange = (event) => {
    controller.setTime(event.detail.value);
  }

  return <div>
    <DateTimePicker
      mode="date"
      value={props.datetime}
      minimumDate={props.minimumDate}
      onChange={handleDateChange} />
    <DateTimePicker
      mode="time"
      value={props.datetime}
      minimumDate={props.minimumDate}
      onChange={handleTimeChange} />
  </div>
};