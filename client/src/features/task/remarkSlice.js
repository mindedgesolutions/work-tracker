import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskRemarks: [],
  remarkId: "",
  allRemarks: [],
  showDelModal: false,
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
    setShowDelModal: (state, action) => {
      state.remarkId = action.payload;
      state.showDelModal = true;
    },
    unsetShowDelModal: (state) => {
      state.remarkId = "";
      state.showDelModal = false;
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
  setShowDelModal,
  unsetShowDelModal,
} = remarkSlice.actions;
export default remarkSlice.reducer;
