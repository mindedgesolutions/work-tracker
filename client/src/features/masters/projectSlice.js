import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  listProject: [],
  addModal: false,
  projectId: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState: initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setListProject: (state, action) => {
      state.listProject = action.payload;
    },
    setProjectId: (state, action) => {
      state.projectId = action.payload;
    },
    unsetProjectId: (state) => {
      state.projectId = null;
    },
    setAddModal: (state) => {
      state.addModal = true;
    },
    unsetAddModal: (state) => {
      state.addModal = false;
    },
  },
});

export const {
  setProjects,
  setListProject,
  setProjectId,
  unsetProjectId,
  setAddModal,
  unsetAddModal,
} = projectSlice.actions;
export default projectSlice.reducer;
