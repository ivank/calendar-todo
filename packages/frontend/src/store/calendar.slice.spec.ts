import { expect, test } from 'vitest';
import { isRangeWithin } from './calendar.slice';

test.each`
  range       | within      | expected
  ${[10, 20]} | ${[10, 50]} | ${true}
  ${[3, 4]}   | ${[10, 50]} | ${false}
  ${[10, 70]} | ${[10, 50]} | ${false}
  ${[80, 90]} | ${[10, 50]} | ${false}
  ${[3, 40]}  | ${[10, 50]} | ${false}
`('isRangeWithin($range, $within) -> $expected', ({ range, within, expected }) => {
  expect(isRangeWithin(range, within)).toBe(expected);
});
