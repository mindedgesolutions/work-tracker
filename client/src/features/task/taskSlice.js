import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskId: "",
  taskAssigns: [],
  editId: "",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    setTaskId: (state, action) => {
      state.taskId = action.payload;
    },
    unsetTaskId: (state) => {
      state.taskId = "";
    },
    setTaskAssigns: (state, action) => {
      state.taskAssigns = action.payload;
    },
  },
});

export const { setTaskId, unsetTaskId, setTaskAssigns } = taskSlice.actions;
export default taskSlice.reducer;
