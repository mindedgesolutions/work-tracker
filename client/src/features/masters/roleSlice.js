import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roles: [],
  listRole: [],
  roleId: null,
};

const roleSlice = createSlice({
  name: "roles",
  initialState: initialState,
  reducers: {
    setRoles: (state, action) => {
      const sorted = [...action.payload].sort((a, b) => a.name - b.name);
      state.roles = sorted;
    },
    setListRole: (state, action) => {
      const sorted = [...action.payload].sort((a, b) => a.name - b.name);
      state.listRole = sorted;
    },
    setRoleId: (state, action) => {
      state.roleId = action.payload;
    },
    unsetRoleId: (state) => {
      state.roleId = null;
    },
  },
});

export const { setRoles, setListRole, setRoleId, unsetRoleId } =
  roleSlice.actions;
export default roleSlice.reducer;
