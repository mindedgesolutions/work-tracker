import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  listProject: [],
  addModal: false,
  projectId: null,
  contacts: [],
  contactCount: 1,
  disabled: true,
  editIndex: "",
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
    setContacts: (state, action) => {
      const { name, email, mobile } = action.payload;
      state.contacts = [...state.contacts, action.payload];
      state.contactCount = state.contactCount + 1;
      console.log(state.contacts);
    },
    removeContact: (state, action) => {
      state.contacts = state.contacts.filter(
        (i, index) => index !== action.payload
      );
    },
    enableEdit: (state, action) => {
      state.editIndex = action.payload;
      state.disabled = false;
    },
    editContact: (state, action) => {
      let details = state.contacts.find(
        (i, index) => index === action.payload.id
      );
      details = {
        ...details,
        name: action.payload.name,
        email: action.payload.email,
        mobile: action.payload.mobile,
      };
      state.contacts = state.contacts.filter(
        (i, index) => index !== action.payload.id
      );
      state.contacts.push(details);
      state.editIndex = "";
      state.disabled = true;
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
  setContacts,
  removeContact,
  enableEdit,
  editContact,
} = projectSlice.actions;
export default projectSlice.reducer;
