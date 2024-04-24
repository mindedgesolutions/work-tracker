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
    },
    unsetLoggedInUser: (state) => {
      state.loggedInUser = "";
    },
  },
});

export const { setCaptcha, setLoggedInUser, unsetLoggedInUser } =
  authSlice.actions;
export default authSlice.reducer;
