import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./features/common/commonSlice";
import roleReducer from "./features/masters/roleSlice";
import userReducer from "./features/users/userSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    roles: roleReducer,
    users: userReducer,
  },
});
