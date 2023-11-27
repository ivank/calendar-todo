import { SerializedError } from '@reduxjs/toolkit';

export const toWeekday = (date: Date): string => date.toLocaleString('en-us', { weekday: 'long' });
export const toHumanDate = (date: Date): string =>
  date.toLocaleString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

/**
 * Convert a JS Date into "days from epoch"
 * https://stackoverflow.com/questions/12739171/javascript-epoch-time-in-days
 */
export const toEpoch = (date: Date): number => Math.trunc(date.getTime() / 8.64e7);

/**
 * Convert a "days from epoch" number into a JS date
 * https://stackoverflow.com/questions/12739171/javascript-epoch-time-in-days
 */
export const fromEpoch = (epoch: number) => new Date(epoch * 8.64e7);

/**
 * Get A text represation of RTK Query error message
 * https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling
 *
 * @param error Error from the query
 * @returns
 */
export const getErrorMessage = (error?: SerializedError | { data?: {} }) =>
  error &&
  ('data' in error && 'message' in error.data
    ? String(error.data.message)
    : 'message' in error
      ? error.message
      : 'error' in error
        ? String(error.error)
        : String(error));

/**
 * Limited reimplement [lodash/range](https://lodash.com/docs/#range)
 * Creates an array of numbers (positive and/or negative)
 *
 * @param start  The start of the range.
 * @param end    The end of the range.
 * @returns      Returns the range of numbers.
 */
export const range = (start: number, end: number): number[] => [...Array(end - start)].map((_, index) => start + index);

/**
 * Limited reimplementation of [lodash/pick](https://lodash.com/docs/#pick)
 * Creates an object composed of the picked object properties.
 *
 * @param object The source object.
 * @param paths  The property paths to pick.
 * @returns      Returns the new object.
 */
export const pick = <T extends {}>(object: T, paths: (keyof T)[]) =>
  object ? paths.reduce((acc, key) => (object[key] ? { ...acc, [key]: object[key] } : acc), {}) : object;

export const isUniqueWith = <T = unknown>(compare: (a: T, b: T) => boolean, array: T[]): T[] => {
  const items: T[] = [];
  for (const item of array) {
    if (!items.some((prev) => compare(prev, item))) {
      items.push(item);
    }
  }
  return items;
};
