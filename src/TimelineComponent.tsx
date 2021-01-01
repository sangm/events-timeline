import React, { FunctionComponent, useState } from 'react';
import { CalendarState, TableData, GridItem } from './lib/types';
import './TimelineComponent.css';

const { RIEInput } = require('riek');

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface TimelineComponentProps {
  tableData: TableData;
  calendarState: CalendarState;
  updateOpacity(gridItem: GridItem, opacity: number): void;
  updateName(id: number, newName: string): void;
}

const TimelineComponent: FunctionComponent<TimelineComponentProps> = ({
  tableData,
  calendarState,
  updateOpacity,
  updateName,
}) => {
  const { calendarMonth, gridItems } = tableData;
  return (
    <div className="calendar">
      <h1 className="month-header">
        <b>{MONTHS[calendarMonth.month]}</b> {calendarMonth.year}
      </h1>
      <div className={`grid grid-${calendarMonth.days}`}>
        {/* javascript really could use a `range` function */}
        {new Array(calendarMonth.days).fill(0).map((_, index) => (
          /* It would've been nice to use css selectors, but since we render all of our
           * divs in a one dimensional array, selectors like :last-child/:last-of-type
           * will not work here
           */
          <div
            className={`day ${
              index + 1 === calendarMonth.days ? 'last-day' : ''
            }`}
            key={index}
          >
            {index + 1}
          </div>
        ))}
        {gridItems.map((gridItem, index) => (
          <div
            key={index}
            className={`event event-${gridItem.id}`}
            onMouseEnter={() => updateOpacity(gridItem, 0.6)}
            onMouseLeave={() => updateOpacity(gridItem, 1)}
            style={{
              gridColumn: `${gridItem.columns[0]}/${gridItem.columns[1]}`,
              gridRow: `${gridItem.row + 2}`,
              ...calendarState[gridItem.id].styles,
            }}
          >
            <RIEInput
              value={calendarState[gridItem.id].name}
              propName="name"
              change={(data: any) => updateName(gridItem.id, data.name)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineComponent;
