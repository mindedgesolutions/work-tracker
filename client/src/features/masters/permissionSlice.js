import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissions: [],
  listPermission: [],
  permissionId: "",
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState: initialState,
  reducers: {
    setPermissions: (state, action) => {
      const sorted = [...action.payload].sort((a, b) => a.name - b.name);
      state.permissions = sorted;
    },
    setListPermission: (state, action) => {
      const sorted = [...action.payload].sort((a, b) => a.name - b.name);
      state.listPermission = sorted;
    },
    setPermissionId: (state, action) => {
      state.permissionId = action.payload;
    },
    unsetPermissionId: (state) => {
      state.permissionId = "";
    },
  },
});

export const {
  setPermissions,
  setListPermission,
  setPermissionId,
  unsetPermissionId,
} = permissionSlice.actions;
export default permissionSlice.reducer;
