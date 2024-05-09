import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskRemarks: [],
  remarkId: "",
  allRemarks: [],
};

const remarkSlice = createSlice({
  name: "remarks",
  initialState: initialState,
  reducers: {
    setTaskRemarks: (state, action) => {
      state.taskRemarks = action.payload;
    },
    unsetTaskRemarks: (state) => {
      state.taskRemarks = [];
    },
    setRemarkId: (state, action) => {
      state.remarkId = action.payload;
    },
    unsetRemarkId: (state) => {
      state.remarkId = "";
    },
    setAllRemarks: (state, action) => {
      state.allRemarks = action.payload;
    },
    unsetAllRemarks: (state) => {
      state.allRemarks = [];
    },
  },
});

export const {
  setTaskRemarks,
  unsetTaskRemarks,
  setRemarkId,
  unsetRemarkId,
  setAllRemarks,
  unsetAllRemarks,
} = remarkSlice.actions;
export default remarkSlice.reducer;
