import { CalendarState, TimelineItem } from './types';
import randomcolor from 'randomcolor';

/**
 * We will be generating random colors since our events could span multiple months
 * and we want to provide a UI friendly way to note when a user is hovering over
 * an event to edit, it spans multiple months
 *
 * To do so, this class represents the central state between all the different
 * months
 */

const initialCalendarState = (timelineItems: TimelineItem[]): CalendarState => {
  return timelineItems.reduce(
    (acc: CalendarState, timelineItem: TimelineItem) => {
      const randomColor = randomcolor({ luminosity: 'light' });
      acc[timelineItem.id] = {
        styles: {
          backgroundColor: randomColor,
          opacity: 1,
        },
        name: timelineItem.name,
      };
      return acc;
    },
    {}
  );
};

export { initialCalendarState };
