import { List, ChangesList, DayList, NamedList } from './api';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ChangesMap = Record<ChangesList['type'], Record<ChangesList['position'], ChangesList>>;

export interface ListsState {
  data: {
    DAY: Record<DayList['position'], DayList>;
    NAMED: Record<NamedList['position'], NamedList>;
  };
  changes: ChangesMap;
}

const now = () => new Date().getTime();

export const maxNamedPosition = (value: ListsState['data']): List['position'] =>
  Math.max(...Object.values(value.NAMED).map((item) => item.position));

export const toChangesLists = (value: ChangesMap): ChangesList[] =>
  ['DAY', 'NAMED'].reduce((acc, key) => acc.concat(Object.values(value[key])), []);

export const toNamedLists = (value: ListsState['data']): NamedList[] => {
  const lists = Object.values(value.NAMED);
  lists.sort((a, b) => a.position - b.position);
  return lists;
};

const empty = { DAY: {}, NAMED: {} };

const initialState: ListsState = { data: empty, changes: empty };

export const dbSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setData(state, { payload }: PayloadAction<List>) {
      const next = { ...payload, updatedAt: now() };
      state.data[payload.type][payload.position] = next;
      state.changes[payload.type][payload.position] = next;
    },

    deleteData(state, { payload }: PayloadAction<List>) {
      const deleted = { ...payload, isDeleted: true, updatedAt: now() };
      delete state.data[payload.type][payload.position];
      state.changes[payload.type][payload.position] = deleted;
    },

    loadData(state, { payload }: PayloadAction<List[]>) {
      for (const item of payload) {
        const current = state.data[item.type][item.position];
        if (!current || current.updatedAt <= item.updatedAt) {
          state.data[item.type][item.position] = item;
        }
      }
    },

    loadChanges(state, { payload }: PayloadAction<ChangesList[]>) {
      for (const item of payload) {
        const current = state.changes[item.type][item.position];

        console.log('Current change', current, 'for', item);
        if (!current || current.updatedAt <= item.updatedAt) {
          state.changes[item.type][item.position] = item;
          console.log('Save back change', item);
        }
      }
    },

    clearChanges(state) {
      state.changes = empty;
    },

    clearAll(state) {
      state.data = empty;
      state.changes = empty;
    },
  },
});

export const { setData, deleteData, loadData, loadChanges, clearAll, clearChanges } = dbSlice.actions;
export const dbReducer = dbSlice.reducer;
