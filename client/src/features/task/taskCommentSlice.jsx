import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskId: "",
};

const taskCommentSlice = createSlice({
  name: "taskComments",
  initialState: initialState,
  reducers: {
    setTaskId: (state, action) => {
      state.taskId = action.payload;
    },
    unsetTaskId: (state) => {
      state.taskId = "";
    },
  },
});

export const { setTaskId, unsetTaskId } = taskCommentSlice.actions;
export default taskCommentSlice.reducer;
