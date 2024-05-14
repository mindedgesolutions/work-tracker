import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listTeam: [],
  showModal: false,
  leadId: "",
  availableMembers: [],
  teamMembers: [],
  memberId: "",
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
    setAvailableMembers: (state, action) => {
      state.availableMembers = action.payload;
    },
    unsetAvailableMembers: (state) => {
      state.availableMembers = [];
    },
    setTeamMembers: (state, action) => {
      state.teamMembers = action.payload;
    },
    unsetTeamMembers: (state) => {
      state.teamMembers = [];
    },
    setMemberId: (state, action) => {
      state.memberId = action.payload;
    },
    unsetMemberId: (state) => {
      state.memberId = "";
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
  setAvailableMembers,
  unsetAvailableMembers,
  setTeamMembers,
  unsetTeamMembers,
  setMemberId,
  unsetMemberId,
} = teamSlice.actions;
export default teamSlice.reducer;
