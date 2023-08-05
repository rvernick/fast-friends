

class DateAndTimeController {
  private date: Date;
  private time: Date;
  private setter: Function;

  constructor(initialDate: Date, setter: Function) {
    this.date = initialDate;
    this.setter = setter;
  }

  setDate(date: Date) {
    this.date = date;
    this.updateDateTime();
  };

  setTime(date: Date) {
    this.time = date;
    this.updateDateTime();
  };

  calculateDateTime() {
    return new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(),
            this.time.getHours(), this.time.getMinutes());
  };

  updateDateTime() {
    console.log(this.calculateDateTime().toLocaleTimeString())
    this.setter(this.calculateDateTime());
  };
}

export default DateAndTimeController;