import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  changeCount: 0,
  priorities: [],
};

const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    updateChangeCount: (state) => {
      state.changeCount += 1;
    },
    setPriorities: (state, action) => {
      state.priorities = action.payload;
    },
    unsetPriorities: (state) => {
      state.priorities = [];
    },
  },
});

export const { updateChangeCount, setPriorities, unsetPriorities } =
  commonSlice.actions;
export default commonSlice.reducer;
