import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskId: "",
  taskAssignees: [],
  editId: "",
  listTask: [],
  showDelModal: false,
  task: "",
  taskRemarks: [],
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
      let newArr = Array.isArray(action.payload)
        ? [...state.taskAssignees, ...action.payload]
        : [...state.taskAssignees, action.payload];
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
      const { userId, userName, priority, time, timeUnit, taskDesc } =
        action.payload;
      let user = state.taskAssignees.find(
        (i) => i.userId === action.payload.userId
      );
      const newMember = {
        ...user,
        userId: userId,
        userName: userName,
        priority: priority,
        time: time,
        timeUnit: timeUnit,
        taskDesc: taskDesc,
      };
      state.taskAssignees = state.taskAssignees.filter(
        (i) => i.userId !== userId
      );
      state.taskAssignees = [...state.taskAssignees, newMember];
    },
    unsetTaskAssigneee: (state) => {
      state.taskAssignees = [];
    },
    setListTask: (state, action) => {
      state.listTask = action.payload;
    },
    setShowDelModal: (state, action) => {
      state.showDelModal = true;
      state.taskId = action.payload;
    },
    unsetShowDelModal: (state) => {
      state.showDelModal = false;
      state.taskId = "";
    },
    setTask: (state, action) => {
      state.task = action.payload;
    },
    unsetTask: (state) => {
      state.task = "";
    },
    setTaskRemarks: (state, action) => {
      state.taskRemarks = action.payload;
    },
    unsetTaskRemarks: (state) => {
      state.taskRemarks = [];
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
  unsetTaskAssigneee,
  setListTask,
  setShowDelModal,
  unsetShowDelModal,
  setTask,
  unsetTask,
  setTaskRemarks,
  unsetTaskRemarks,
} = taskSlice.actions;
export default taskSlice.reducer;
