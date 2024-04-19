import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  listProject: [],
  addModal: false,
  projectId: null,
  contacts: [],
  disabled: true,
  editIndex: "",
  viewModal: false,
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
      const { id, name, email, mobile } = action.payload;
      state.contacts = !state.contacts
        ? [action.payload]
        : [...state.contacts, action.payload];
    },
    removeContact: (state, action) => {
      state.contacts = state.contacts.filter((i) => i.id !== action.payload);
    },
    enableEdit: (state, action) => {
      state.editIndex = action.payload;
      state.disabled = false;
    },
    editContact: (state, action) => {
      let details = state.contacts.find((i) => i.id === action.payload.id);
      details = {
        ...details,
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        mobile: action.payload.mobile,
      };
      state.contacts = state.contacts.filter((i) => i.id !== action.payload.id);
      state.contacts.push(details);
      state.editIndex = "";
      state.disabled = true;
    },
    unsetContacts: (state) => {
      state.contacts = [];
    },
    unsetEditId: (state) => {
      state.editIndex = "";
    },
    setDbContacts: (state, action) => {
      state.contacts = action.payload;
    },
    setViewModal: (state, action) => {
      state.projectId = action.payload;
      state.viewModal = true;
    },
    unsetViewModal: (state) => {
      state.viewModal = false;
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
  unsetContacts,
  unsetEditId,
  setDbContacts,
  setViewModal,
  unsetViewModal,
} = projectSlice.actions;
export default projectSlice.reducer;
