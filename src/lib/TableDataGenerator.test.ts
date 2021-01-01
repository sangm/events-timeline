import { TableData } from './types';
import TableDataGenerator from './TableDataGenerator';

test('parses single event', () => {
  const data = [
    {
      id: 1,
      start: '2018-01-01',
      end: '2018-01-05',
      name: 'First item',
    },
  ];

  const expectedData: TableData = {
    gridItems: [{ id: 1, columns: [1, 5], name: 'First item', row: 0 }],
    calendarMonth: {
      year: 2018,
      month: 0,
      days: 31,
    },
  };

  const actualData = new TableDataGenerator().generate(data);
  expect(actualData[0]).toMatchObject(expectedData);
});

test('parses multiple events', () => {
  const data = [
    {
      id: 1,
      start: '2018-01-01',
      end: '2018-01-05',
      name: 'First item',
    },
    {
      id: 2,
      start: '2018-01-02',
      end: '2018-01-08',
      name: 'Second item',
    },
  ];

  const expectedData: TableData = {
    gridItems: [
      { id: 1, columns: [1, 5], name: 'First item', row: 0 },
      { id: 2, columns: [2, 8], name: 'Second item', row: 1 },
    ],
    calendarMonth: {
      year: 2018,
      month: 0,
      days: 31,
    },
  };

  const actualData = new TableDataGenerator().generate(data);
  expect(actualData[0]).toMatchObject(expectedData);
});

test('parses single event with event lasting longer than the month', () => {
  const data = [
    {
      id: 4,
      start: '2018-01-12',
      end: '2018-02-15',
      name: 'super long item',
    },
  ];

  const firstMonthData: TableData = {
    gridItems: [{ id: 4, columns: [12, 31], name: 'super long item', row: 0 }],
    calendarMonth: {
      year: 2018,
      month: 0,
      days: 31,
    },
  };

  const secondMonthData: TableData = {
    gridItems: [{ id: 4, columns: [1, 15], name: 'super long item', row: 0 }],
    calendarMonth: {
      year: 2018,
      month: 1,
      days: 28,
    },
  };

  const actualData = new TableDataGenerator().generate(data);
  expect(actualData).toHaveLength(2);
  expect(actualData[0]).toMatchObject(firstMonthData);
  expect(actualData[1]).toMatchObject(secondMonthData);
});

test('parses single event with more than 1 month', () => {
  const data = [
    {
      id: 4,
      start: '2018-01-01',
      end: '2018-03-01',
      name: 'super long item',
    },
  ];

  const firstMonthData: TableData = {
    gridItems: [{ id: 4, columns: [1, 31], name: 'super long item', row: 0 }],
    calendarMonth: {
      year: 2018,
      month: 0,
      days: 31,
    },
  };

  const secondMonthData: TableData = {
    gridItems: [{ id: 4, columns: [1, 28], name: 'super long item', row: 0 }],
    calendarMonth: {
      year: 2018,
      month: 1,
      days: 28,
    },
  };

  const thirdMonthData: TableData = {
    gridItems: [{ id: 4, columns: [1, 1], name: 'super long item', row: 0 }],
    calendarMonth: {
      year: 2018,
      month: 2,
      days: 31,
    },
  };

  const actualData = new TableDataGenerator().generate(data);
  expect(actualData).toHaveLength(3);
  expect(actualData[0]).toMatchObject(firstMonthData);
  expect(actualData[1]).toMatchObject(secondMonthData);
  expect(actualData[2]).toMatchObject(thirdMonthData);
});

test('parses single event with more than 1 month passing a year', () => {
  const data = [
    {
      id: 1,
      start: '2018-12-22',
      end: '2019-1-05',
      name: 'super long item',
    },
  ];

  const firstMonthData: TableData = {
    gridItems: [{ id: 1, columns: [22, 31], name: 'super long item', row: 0 }],
    calendarMonth: {
      year: 2018,
      month: 11,
      days: 31,
    },
  };

  const secondMonthData: TableData = {
    gridItems: [{ id: 1, columns: [1, 5], name: 'super long item', row: 0 }],
    calendarMonth: {
      year: 2019,
      month: 0,
      days: 31,
    },
  };

  const actualData = new TableDataGenerator().generate(data);
  expect(actualData).toHaveLength(2);
  expect(actualData[0]).toMatchObject(firstMonthData);
  expect(actualData[1]).toMatchObject(secondMonthData);
});

test('parses single event with 1 year', () => {
  const data = [
    {
      id: 1,
      start: '2018-12-22',
      end: '2019-12-22',
      name: 'super long item',
    },
  ];

  const firstMonthData: TableData = {
    gridItems: [{ id: 1, columns: [22, 31], name: 'super long item', row: 0 }],
    calendarMonth: {
      year: 2018,
      month: 11,
      days: 31,
    },
  };

  const secondMonthData: TableData = {
    gridItems: [{ id: 1, columns: [1, 31], name: 'super long item', row: 0 }],
    calendarMonth: {
      year: 2019,
      month: 0,
      days: 31,
    },
  };

  const lastMonth: TableData = {
    gridItems: [{ id: 1, columns: [1, 22], name: 'super long item', row: 0 }],
    calendarMonth: {
      year: 2019,
      month: 11,
      days: 31,
    },
  };

  const expectedMonths = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const actualData = new TableDataGenerator().generate(data);

  expect(actualData).toHaveLength(13);
  expect(actualData.map((data) => data.calendarMonth.month)).toEqual(
    expectedMonths
  );
  expect(actualData[0]).toMatchObject(firstMonthData);
  expect(actualData[1]).toMatchObject(secondMonthData);
  expect(actualData[12]).toMatchObject(lastMonth);
});
