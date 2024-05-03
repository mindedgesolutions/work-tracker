import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./features/common/commonSlice";
import roleReducer from "./features/masters/roleSlice";
import projectReducer from "./features/masters/projectSlice";
import permissionReducer from "./features/masters/permissionSlice";
import teamReducer from "./features/masters/teamSlice";
import userReducer from "./features/users/userSlice";
import authReducer from "./features/auth/authSlice";
import taskReducer from "./features/task/taskSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    roles: roleReducer,
    projects: projectReducer,
    permissions: permissionReducer,
    teams: teamReducer,
    users: userReducer,
    auth: authReducer,
    tasks: taskReducer,
  },
});
