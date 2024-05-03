import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listTeam: [],
  showModal: false,
  leadId: "",
};

const teamSlice = createSlice({
  name: "teams",
  initialState: initialState,
  reducers: {
    setListTeam: (state, action) => {
      state.listTeam = action.payload;
    },
    unsetListTeam: (state) => {
      state.listTeam = [];
    },
    setShowModal: (state) => {
      state.showModal = true;
    },
    unsetShowModal: (state) => {
      state.showModal = false;
    },
    setLeadId: (state, action) => {
      state.leadId = action.payload;
    },
    unsetLeadId: (state) => {
      state.leadId = "";
    },
  },
});

export const {
  setListTeam,
  unsetListTeam,
  setShowModal,
  unsetShowModal,
  setLeadId,
  unsetLeadId,
} = teamSlice.actions;
export default teamSlice.reducer;
