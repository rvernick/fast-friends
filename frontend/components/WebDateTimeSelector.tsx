import React, { useState } from "react";
import {Platform, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import { DatePickerInput, TimePickerModal } from 'react-native-paper-dates';
import DateAndTimeController from "./DateAndTimeController";

export const WebDateTimeSelector = (props) => {
  const [visible, setVisible] = useState(false)
  const [date, setDate] = useState(props.value);


  const setDateTime = function(date: Date) {
    setDate(date);
    setVisible(false);
    props.setter(date);
    // rerender();
  }
  const controller = new DateAndTimeController(date, setDateTime);

  function rerender() {
    this.forceUpdate();
  }

  const handleDateChange = (event) => {
    controller.setDate(event.detail.value);
  }

  const onDismiss = () => {
    setVisible(false)
  };

  const onConfirm = (hoursAndMinutes) => {
    console.log('onConfirm');
    console.log(hoursAndMinutes.hours + ':' + hoursAndMinutes.minutes);
    setVisible(false);
    var date = new Date();
    date.setHours(hoursAndMinutes.hours);
    date.setMinutes(hoursAndMinutes.minutes);
    controller.setTime(date);
  };

  return <div>
    <DatePickerInput
            locale="en"
            value={date}
            onChange={handleDateChange}
            inputMode="start"
          />
    <Button onPress={() => setVisible(true)} uppercase={false} mode="outlined">
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </Button>
    <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={date.getHours()}
          minutes={date.getMinutes()}
   />
  </div>
};