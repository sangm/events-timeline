import CalendarMonth from './CalendarMonth';

/**
 * This type is tightly coupled with the notion of "css-grid". Given a "timeline
 * item" (mock data given for this assignment) we convert it into an array of `GridItem`
 */
export type GridItem = {
  id: number;
  columns: [number, number];
  row: number;
  name: string;
};

export type TableData = {
  gridItems: GridItem[];
  calendarMonth: CalendarMonth;
};

export type TimelineItem = {
  id: number;
  start: string;
  end: string;
  name: string;
};

export type CalendarStateProperty = {
  styles: {
    backgroundColor: string;
    opacity: number;
  };
  name: string;
};

export type CalendarState = { [key: number]: CalendarStateProperty };
