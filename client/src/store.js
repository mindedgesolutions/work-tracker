import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./features/common/commonSlice";
import roleReducer from "./features/masters/roleSlice";
import projectReducer from "./features/masters/projectSlice";
import userReducer from "./features/users/userSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    roles: roleReducer,
    projects: projectReducer,
    users: userReducer,
  },
});
