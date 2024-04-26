import { createSlice } from "@reduxjs/toolkit";

const generateCaptcha = () => {
  const captchaChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += captchaChars.charAt(
      Math.floor(Math.random() * captchaChars.length)
    );
  }
  return captcha;
};

const initialState = {
  captcha: "",
  loggedInUser: "",
  returnPath: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCaptcha: (state) => {
      state.captcha = generateCaptcha();
    },
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
      switch (action.payload.role_id) {
        case 1 || 2:
          state.returnPath = "/admin";
          break;
        case 3 || 4:
          state.returnPath = "/lead";
          break;
        default:
          state.returnPath = "/user";
          break;
      }
    },
    unsetLoggedInUser: (state) => {
      state.loggedInUser = "";
      state.returnPath = "";
    },
  },
});

export const { setCaptcha, setLoggedInUser, unsetLoggedInUser } =
  authSlice.actions;
export default authSlice.reducer;
