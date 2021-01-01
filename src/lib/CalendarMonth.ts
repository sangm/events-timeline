export default class CalendarMonth {
  year: number;
  month: number;
  days: number;

  private static DELIMITTER: string = '|';

  constructor(year: number, month: number, days: number) {
    this.year = year;
    this.month = month;
    this.days = days;
  }

  static fromString(calendarMonth: string): CalendarMonth {
    const [year, month, days] = calendarMonth
      .split(this.DELIMITTER)
      .map((elem) => parseInt(elem));
    return new CalendarMonth(year, month, days);
  }

  toString(): string {
    return `${this.year}${CalendarMonth.DELIMITTER}${this.month}${CalendarMonth.DELIMITTER}${this.days}`;
  }
}
