import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskId: "",
  taskAssignees: [],
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
    setTaskAssignees: (state, action) => {
      let newArr = [...state.taskAssignees, action.payload];
      newArr = newArr.sort((a, b) => a.userName - b.userName);
      state.taskAssignees = newArr;
    },
    removeTaskAssignee: (state, action) => {
      const newArr = state.taskAssignees.filter(
        (i) => i.userId !== action.payload
      );
      state.taskAssignees = newArr;
    },
    editTaskAssignee: (state, action) => {
      state.editId = action.payload;
    },
    unsetEditId: (state) => {
      state.editId = "";
    },
    saveChanges: (state, action) => {
      state.taskAssignees.filter((i) => i.userId !== action.payload.userId);
      state.taskAssignees = [...state.taskAssignees, action.payload];
    },
  },
});

export const {
  setTaskId,
  unsetTaskId,
  setTaskAssignees,
  removeTaskAssignee,
  editTaskAssignee,
  unsetEditId,
  saveChanges,
} = taskSlice.actions;
export default taskSlice.reducer;
