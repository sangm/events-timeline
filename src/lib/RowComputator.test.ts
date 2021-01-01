import RowComputator, { overlap } from './RowComputator';

test('computes row from single day', () => {
  const rowComputator = new RowComputator();

  expect(rowComputator.compute(2018, 1, [1, 1])).toBe(0);
  expect(rowComputator.compute(2018, 1, [2, 3])).toBe(0);
  expect(rowComputator.compute(2018, 1, [4, 6])).toBe(0);
  expect(rowComputator.compute(2018, 1, [1, 2])).toBe(1);
});

test('overlap', () => {
  expect(overlap([1, 2], [1, 2])).toBe(true);
  expect(overlap([1, 2], [1, 3])).toBe(true);
  expect(overlap([1, 2], [3, 3])).toBe(false);
  expect(overlap([1, 3], [3, 3])).toBe(true);
  expect(overlap([3, 4], [1, 2])).toBe(false);
  expect(overlap([1, 1], [1, 2])).toBe(true);
  expect(overlap([1, 5], [2, 8])).toBe(true);
});
