import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissions: [],
  listPermission: [],
  permissionId: "",
  rolePermissionModal: false,
  roleId: "",
  userPermissionModal: false,
  userId: "",
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
    setRolePermissionModal: (state, action) => {
      state.roleId = action.payload;
      state.rolePermissionModal = true;
    },
    unsetRolePermissionModal: (state) => {
      state.roleId = "";
      state.rolePermissionModal = false;
    },
    setUserPermissionModal: (state, action) => {
      state.userId = action.payload;
      state.userPermissionModal = true;
    },
    unsetUserPermissionModal: (state) => {
      state.userId = "";
      state.userPermissionModal = false;
    },
  },
});

export const {
  setPermissions,
  setListPermission,
  setPermissionId,
  unsetPermissionId,
  setRolePermissionModal,
  unsetRolePermissionModal,
  setUserPermissionModal,
  unsetUserPermissionModal,
} = permissionSlice.actions;
export default permissionSlice.reducer;
