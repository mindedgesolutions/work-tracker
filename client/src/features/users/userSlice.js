import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  userUuid: 0,
  showDelModal: false,
  showViewModal: false,
};

const userSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setUsers: (state, action) => {
      const sorted = [...action.payload].sort((a, b) => a.name - b.name);
      state.users = sorted;
    },
    setUserUuid: (state, action) => {
      state.userUuid = action.payload;
      localStorage.setItem("uid", action.payload);
    },
    unsetUserUuid: (state) => {
      state.userUuid = 0;
      localStorage.removeItem("uid");
    },
    setShowModal: (state, action) => {
      action.payload.type === "delete"
        ? (state.showDelModal = true)
        : (state.showViewModal = true);
    },
    unsetShowModal: (state, action) => {
      action.payload.type === "delete"
        ? (state.showDelModal = false)
        : (state.showViewModal = false);
    },
  },
});

export const {
  setUsers,
  setUserUuid,
  unsetUserUuid,
  setShowModal,
  unsetShowModal,
} = userSlice.actions;
export default userSlice.reducer;
