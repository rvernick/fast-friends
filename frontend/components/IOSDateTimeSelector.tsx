import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';

export const IOSDateTimeSelector = (props) => {
  const [date, setDate] = useState(props.value);

  const handleDateChange = (event, selectedDate) => {
    const {
      type,
      nativeEvent: {timestamp},
    } = event;
    if (type === 'set') {
      props.setter(selectedDate);
      setDate(selectedDate);
    }
  };

  return <DateTimePicker
      mode="datetime"
      value={date}
       minimumDate={props.minimumDate}
       minuteInterval={5}
       onChange={handleDateChange}
      />;
};