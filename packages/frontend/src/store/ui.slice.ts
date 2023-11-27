import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { toEpoch } from '../helpers.js';

export type Range = [from: number, to: number];

/**
 * Data representing what to load from a list, as well as which part of it to show
 * This allows for loading of more items than are displayed, and only triggering reload
 * when the show window goes outside of data
 */
export type Window = {
  /**
   * The range to show from within data Range
   */
  show: Range;
  /**
   * Range that's loaded from the serer
   */
  data: Range;
  /**
   * where to start the show range in the data range
   */
  current: number;
};

/**
 * Check if range is fully within another range
 */
export const isRangeWithin = (range: Range, within: Range): boolean => range[0] >= within[0] && range[1] <= within[1];

export interface ListsState {
  /**
   * {@link Window} for the calendar days related todos
   */
  day: Window;
  /**
   * {@link Window} for the named todos that are not linked to days
   */
  named: Window;

  /**
   * How many lists to show in the line
   */
  size: number;

  /**
   * Should the named todos section be shown (or hidden)
   */
  namedShown: boolean;
}

const initialSize = 5;
const initialCurrent = toEpoch(new Date()) - 1;

/**
 * Create the data and show ranges for a given size.
 * The data range should be bigger and enclose the show range
 */
const toWindow = (current: number, size: number, bufferSize = 50): Window => ({
  show: [current, current + size],
  data: [current - bufferSize, current + size + bufferSize],
  current,
});

const initialState: ListsState = {
  day: toWindow(initialCurrent, initialSize),
  named: toWindow(0, initialSize),
  size: initialSize,
  namedShown: true,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setWindowSize(state, action: PayloadAction<number>) {
      state.size = action.payload;
      const nextDay = toWindow(state.day.current, state.size);
      const nextNamed = toWindow(state.named.current, state.size);
      state.day = isRangeWithin(nextDay.show, state.day.data) ? { ...state.day, show: nextDay.show } : nextDay;
      state.named = { ...state.named, show: nextNamed.show };
    },

    setDayCurrent(state, action: PayloadAction<number>) {
      const next = toWindow(action.payload, state.size);
      state.day = isRangeWithin(next.show, state.day.data)
        ? { ...state.day, show: next.show, current: next.current }
        : next;
    },

    setNamedCurrent(state, action: PayloadAction<number>) {
      const next = toWindow(action.payload, state.size);
      state.named = isRangeWithin(next.show, state.day.data)
        ? { ...state.named, show: next.show, current: next.current }
        : next;
    },

    setNamedShown(state, action: PayloadAction<boolean>) {
      state.namedShown = action.payload;
    },
  },
});

export const { setWindowSize, setDayCurrent, setNamedCurrent, setNamedShown } = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
