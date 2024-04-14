import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  changeCount: 0,
};

const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    updateChangeCount: (state) => {
      state.changeCount += 1;
    },
  },
});

export const { updateChangeCount } = commonSlice.actions;
export default commonSlice.reducer;
