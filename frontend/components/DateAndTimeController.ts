

class DateAndTimeController {
  private date: Date;
  private setter: Function;

  constructor(initialDate: Date, setter: Function) {
    console.log('init dtc: ' + initialDate);
    this.date = initialDate;
    this.setter = setter;
  }

  setDate(toDate: Date) {
    this.date = this.calculateDateTime(toDate, this.date);
    this.setter(this.date);
  };

  setTime(toTime: Date) {
    this.date = this.calculateDateTime(this.date, toTime);
    this.setter(this.date);
  };

  getDate(): Date {
    const result = this.date;
    console.log('controller giving date: ' + result);
    return result;
  }

  calculateDateTime(day: Date, time: Date) : Date {
    console.log('controller date: ' + this.date);
    console.log('controller day: ' + day);
    console.log('controller time: ' + time);
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(),
            time.getHours(), time.getMinutes());
  };
}

export default DateAndTimeController;