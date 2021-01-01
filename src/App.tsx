import React, { useState } from 'react';
import timelineItems from './timelineItems';
import TimelineComponent from './TimelineComponent';
import TableDataGenerator from './lib/TableDataGenerator';
import { initialCalendarState } from './lib/CalendarState';
import { GridItem } from './lib/types';
import './App.css';

function App() {
  const timelineMonths = new TableDataGenerator().generate(timelineItems);
  const [calendarState, setCalendarState] = useState(
    initialCalendarState(timelineItems)
  );

  const updateOpacity = (gridItem: GridItem, opacity: number) => {
    const item = calendarState[gridItem.id];
    const newStyles = { ...calendarState[gridItem.id].styles, opacity };

    setCalendarState({
      ...calendarState,
      [gridItem.id]: {
        ...item,
        styles: newStyles,
      },
    });
  };

  const updateName = (id: number, newName: string) => {
    const item = calendarState[id];

    setCalendarState({
      ...calendarState,
      [id]: {
        ...item,
        name: newName,
      },
    });
  };

  return (
    <div>
      {timelineMonths.map((tableData, index) => (
        <TimelineComponent
          key={index}
          calendarState={calendarState}
          tableData={tableData}
          updateOpacity={updateOpacity}
          updateName={updateName}
        />
      ))}
    </div>
  );
}

export default App;
