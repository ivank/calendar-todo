import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { toEpoch } from '../helpers';

export type Range = [from: number, to: number];
export type Window = { size: number; show: Range; data: Range; current: number };
const isRangeWithin = (range: Range, within: Range): boolean => range[0] >= within[0] && range[1] <= within[1];

export interface CalendarState {
  window: Window;
  dayPickerShown: boolean;
}

const bufferSize = 10;
const initialSize = 5;
const initialCurrent = toEpoch(new Date());

const toWindow = (current: number, size: number): Window => ({
  size,
  show: [current, current + size],
  data: [current - bufferSize, current + size + bufferSize],
  current,
});

const initialState: CalendarState = {
  window: toWindow(initialCurrent, initialSize),
  dayPickerShown: false,
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setWindowSize: (state, action: PayloadAction<number>) => {
      const nextWindow = toWindow(state.window.current, action.payload);
      if (isRangeWithin(nextWindow.show, state.window.data)) {
        state.window.size = action.payload;
      } else {
        state.window = nextWindow;
      }
    },
    setWindowCurrent: (state, action: PayloadAction<number>) => {
      const nextWindow = toWindow(action.payload, state.window.size);
      if (isRangeWithin(nextWindow.show, state.window.data)) {
        state.window.show = nextWindow.show;
        state.window.current = nextWindow.current;
      } else {
        state.window = nextWindow;
      }
    },
    showDayicker: (state) => {
      state.dayPickerShown = true;
    },
    hideDayPicker: (state) => {
      state.dayPickerShown = false;
    },
  },
});

export const { setWindowSize, setWindowCurrent, showDayicker, hideDayPicker } = calendarSlice.actions;
export const calendarReducer = calendarSlice.reducer;
