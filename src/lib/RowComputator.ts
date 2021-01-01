/**
 * We are using CSS Grid to generate the right layout in a space compact way. We
 * will be using this class to manually compute the row rather than depending on
 * grid auto flow properties.
 */
export interface RowComputator {
  compute(year: number, month: number, range: [number, number]): number;
}

export default class RowComputatorImpl implements RowComputator {
  #state: { [key: string]: [number, number][][] };

  constructor() {
    this.#state = {};
  }

  /**
   * We maintain a map given a date and range. We check to see if given range of numbers(represent columns in css-grid),
   * we check to see which row it needs to go into.
   *
   * For example, given an event happening between February 10 2018 and February 18 2018, we will be given
   * year: 2018
   * month: 01 (0th index)
   * range: [9, 17]
   *
   * we insert into the cache
   *
   * {
   *   '2018|01': [[(9, 17)]]
   * }
   *
   * Next time this is called, with another event happening between February 19 2018 / February 20 2018,
   *
   * {
   *   '2018|01': [[(9, 17), (18, 19)]]
   * }
   *
   * Finally, if there is event that needs to happen in a separate row: February 15 2018 to February 21 2018
   *
   * {
   *   '2018|01': [[(9, 17), (18, 19)], [(14, 20)]]
   * }
   *
   * The top array represent the potential number of rows (every event could overlap)
   * The inner array represent a specific row
   *
   */
  compute(year: number, month: number, range: [number, number]): number {
    const key = `${year}|${month}`;
    if (!(key in this.#state)) {
      this.#state[key] = [];
    }

    const monthRows: [number, number][][] = this.#state[key];
    // go through each "row" and find the first row where we do not have overlap
    const index = monthRows.findIndex(monthRow =>
      monthRow.every(rowRange => !overlap(rowRange, range))
    );
    if (index !== -1) {
      // this means we found a suitable row for this range
      const rows: [number, number][] = monthRows[index];
      rows.push(range);
      return index;
    } else {
      // we did not find a suitable slot for our range. We need to insert new one
      const newRows = [range];
      monthRows.push(newRows);
      return monthRows.length - 1;
    }
  }
}

// exported so we can unit test
export const overlap = (a: [number, number], b: [number, number]): boolean => {
  if (b[0] > a[0] && b[0] > a[1]) {
    return false;
  } else if (b[0] < a[0] && b[0] < a[1]) {
    return false;
  }
  return true;
};
