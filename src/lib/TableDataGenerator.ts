import dayjs from 'dayjs';
import RowComputator from './RowComputator';
import { TableData, GridItem, TimelineItem } from './types';
import CalendarMonth from './CalendarMonth';

export interface TableDataGenerator {
  generate(timelineItems: TimelineItem[]): TableData[];
}

/**
 * This class is responsible for converting the given sample data to data
 * structures suitable for the rest of the application. Notably the type
 * `TableData` is what the rest of application depend on.
 */
export default class TableDataGeneratorImpl implements TableDataGenerator {
  private serializeTimelineItem(
    timelineItem: TimelineItem,
    rowComputator: RowComputator
  ): [CalendarMonth, GridItem][] {
    const { start, end, id, name } = timelineItem;

    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const [startYear, startMonth, startDay] = [
      startDate.year(),
      startDate.month(),
      startDate.date(),
    ];

    const [endYear, endMonth, endDay] = [
      endDate.year(),
      endDate.month(),
      endDate.date(),
    ];

    const startLastDay = startDate.daysInMonth();
    const calendarMonth = new CalendarMonth(
      startYear,
      startMonth,
      startLastDay
    );

    // This is the simplest case where all the events are contained within the same month/same year
    if (startYear === endYear && startMonth === endMonth) {
      const columns: [number, number] = [startDay, endDay];

      return [
        [
          calendarMonth,
          {
            id,
            columns,
            row: rowComputator.compute(startYear, startMonth, columns),
            name,
          },
        ],
      ];
    }

    /**
     * I included a recursive version below because it's how I initially implemented it.
     * IMO it's easier to understand, but it's less space efficient and would run into
     * call stack size exceeding if the date ranges are too big.
     *
     * const newStart = startDate
     *   .add(1, 'month')
     *   .set('date', 1)
     *   .format('YYYY-MM-DD');
     *
     * return [
     *   [
     *     calendarMonth,
     *    {
     *      id,
     *      name,
     *      columns,
     *      row: rowComputator.compute(startYear, startMonth, columns),
     *    },
     *   ],
     *   ...this.serializeTimelineItem(
     *     { start: newStart, end, id, name },
     *     rowComputator
     *   ),
     * ];
     */

    // Conceptually what we are doing here is to iterate month to month and set
    // the day to maximum number of days in a month until we get to the _last_
    // month, where we we would use the given day.
    // For example, given a date range of 2018-4-1 to 2018-6-5
    // We generate [2018-4-30, 2018-5-31, 2018-6-5]

    let monthsDifference: number = endDate.diff(startDate, 'month');
    // In case of an input like start: 2018-12-22, 2019-01-4
    // The "month" difference would be 0, but the day difference is > 0.
    // In that case, we need to generate the event for the a month
    if (monthsDifference === 0 && endDate.diff(startDate, 'day') > 0) {
      monthsDifference = 1;
    }

    const months: [CalendarMonth, GridItem][] = Array.from(
      Array(monthsDifference).keys()
    )
      .map((month) => startDate.add(month + 1, 'month'))
      .map((month, index) => {
        const date =
          index + 1 === monthsDifference ? endDay : month.daysInMonth();

        const calendarMonth = new CalendarMonth(
          month.year(),
          month.month(),
          month.daysInMonth()
        );

        const columns: [number, number] = [1, date];
        const gridItem: GridItem = {
          id,
          columns,
          name,
          row: rowComputator.compute(month.year(), month.month(), columns),
        };
        return [calendarMonth, gridItem];
      });

    const columns: [number, number] = [startDay, startLastDay];

    return [
      [
        calendarMonth,
        {
          id,
          name,
          columns,
          row: rowComputator.compute(startYear, startMonth, columns),
        },
      ],
      ...months,
    ];
  }

  generate(timelineItems: TimelineItem[]): TableData[] {
    const rowComputator = new RowComputator();

    const events = timelineItems
      .flatMap((timelineItem) =>
        this.serializeTimelineItem(timelineItem, rowComputator)
      )
      .reduce((acc: { [key: string]: GridItem[] }, current) => {
        const key = current[0].toString();
        if (!(key in acc)) {
          acc[key] = [];
        }

        acc[key].push(current[1]);
        return acc;
      }, {});

    return Object.entries(events).map(([key, gridItems]) => ({
      calendarMonth: CalendarMonth.fromString(key),
      gridItems,
    }));
  }
}
