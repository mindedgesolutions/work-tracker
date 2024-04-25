import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  changeCount: 0,
  priorities: [],
  userNameIds: [],
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
    setUserNameIds: (state, action) => {
      state.userNameIds = action.payload;
    },
  },
});

export const {
  updateChangeCount,
  setPriorities,
  unsetPriorities,
  setUserNameIds,
} = commonSlice.actions;
export default commonSlice.reducer;
