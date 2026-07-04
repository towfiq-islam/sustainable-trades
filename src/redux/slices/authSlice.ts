import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  latitude: number | null;
  longitude: number | null;
  search: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  latitude: null,
  longitude: null,
  search: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: state => {
      state.isAuthenticated = true;
    },
    removeUser: state => {
      state.isAuthenticated = false;
    },
    setLatitude: (state, action: PayloadAction<number>) => {
      state.latitude = action.payload;
    },
    setLongitude: (state, action: PayloadAction<number>) => {
      state.longitude = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { setUser, removeUser, setLatitude, setLongitude, setSearch } =
  authSlice.actions;
export default authSlice.reducer;
