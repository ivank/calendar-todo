import { SerializedError } from '@reduxjs/toolkit';

export const toISODate = (date: Date): string => date.toISOString().substring(0, 10);
export const fromISODate = (date: string): Date => new Date(date);
export const toEpoch = (date: Date): number => Math.trunc(date.getTime() / 8.64e7);
export const toWeekday = (date: Date): string => date.toLocaleString('en-us', { weekday: 'long' });
export const toHumanDate = (date: Date): string =>
  date.toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });
export const fromEpoch = (epoch: number) => new Date(epoch * 8.64e7);
export const range = (from: number, to: number): number[] => [...Array(to - from)].map((_, index) => from + index);

export const getErrorMessage = (error?: SerializedError | { data?: {} }) =>
  error &&
  ('data' in error && 'message' in error.data
    ? String(error.data.message)
    : 'message' in error
      ? error.message
      : 'Unknown Error');
