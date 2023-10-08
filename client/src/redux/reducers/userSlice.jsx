// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loginModal: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      localStorage.removeItem("token");
      state.user = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    setLoginModal: (state, action) => {
      state.loginModal = action.payload;
    },
  },
});

export const { setUser, clearUser, updateUser, setLoginModal } =
  userSlice.actions;

export default userSlice.reducer;
