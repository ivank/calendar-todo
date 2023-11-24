import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { toEpoch } from '../helpers';

export type Range = [from: number, to: number];
export type Window = { show: Range; data: Range; current: number };
export const isRangeWithin = (range: Range, within: Range): boolean => range[0] >= within[0] && range[1] <= within[1];

export interface ListsState {
  day: Window;
  named: Window;
  size: number;
  dayPickerShown: boolean;
}

const bufferSize = 20;
const initialSize = 5;
const initialCurrent = toEpoch(new Date());

const toWindow = (current: number, size: number): Window => ({
  show: [current, current + size],
  data: [current - bufferSize, current + size + bufferSize],
  current,
});

const initialState: ListsState = {
  day: toWindow(initialCurrent, initialSize),
  named: toWindow(0, initialSize),
  size: initialSize,
  dayPickerShown: false,
};

export const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setWindowSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
      const nextDay = toWindow(state.day.current, state.size);
      const nextNamed = toWindow(state.named.current, state.size);
      state.day = isRangeWithin(nextDay.show, state.day.data) ? { ...state.day, show: nextDay.show } : nextDay;
      state.named = { ...state.named, show: nextNamed.show };
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
    showDayicker: (state) => {
      state.dayPickerShown = true;
    },
    hideDayPicker: (state) => {
      state.dayPickerShown = false;
    },
  },
});

export const { setWindowSize, setDayCurrent, setNamedCurrent, showDayicker, hideDayPicker } = listsSlice.actions;
export const listsReducer = listsSlice.reducer;
