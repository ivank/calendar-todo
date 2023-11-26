import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toEpoch } from "../helpers.js";
import { createStateStorage } from "./state-storage.js";

export type Range = [from: number, to: number];

/**
 * Data represinging what to laod from a list, as well as which part of it to show
 * This allows for laoding of more items than are displayed, and only triggering reload
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
export const isRangeWithin = (range: Range, within: Range): boolean =>
  range[0] >= within[0] && range[1] <= within[1];

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

const name = "lists";
const initialSize = 5;
const initialCurrent = toEpoch(new Date());

/**
 * Create the data and show ranges for a given size.
 * The data range should be bigger and enclose the show range
 */
const toWindow = (current: number, size: number, bufferSize = 50): Window => ({
  show: [current, current + size],
  data: [current - bufferSize, current + size + bufferSize],
  current,
});

const { loadState, saveState } = createStateStorage<ListsState>(name, [
  "namedShown",
  "size",
]);

const initialState: ListsState = loadState({
  day: toWindow(initialCurrent, initialSize),
  named: toWindow(0, initialSize),
  size: initialSize,
  namedShown: true,
});

export const listsSlice = createSlice({
  name,
  initialState,
  reducers: {
    setWindowSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
      const nextDay = toWindow(state.day.current, state.size);
      const nextNamed = toWindow(state.named.current, state.size);
      state.day = isRangeWithin(nextDay.show, state.day.data)
        ? { ...state.day, show: nextDay.show }
        : nextDay;
      state.named = { ...state.named, show: nextNamed.show };
      saveState(state);
    },
    setDayCurrent: (state, action: PayloadAction<number>) => {
      const next = toWindow(action.payload, state.size);
      state.day = isRangeWithin(next.show, state.day.data)
        ? { ...state.day, show: next.show, current: next.current }
        : next;
    },
    setNamedCurrent: (state, action: PayloadAction<number>) => {
      const next = toWindow(action.payload, state.size);
      state.named = isRangeWithin(next.show, state.day.data)
        ? { ...state.named, show: next.show, current: next.current }
        : next;
    },
    setNamedShown: (state, action: PayloadAction<boolean>) => {
      state.namedShown = action.payload;
      saveState(state);
    },
  },
});

export const { setWindowSize, setDayCurrent, setNamedCurrent, setNamedShown } =
  listsSlice.actions;
export const listsReducer = listsSlice.reducer;
