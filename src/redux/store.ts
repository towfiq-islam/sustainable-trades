import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/redux/api/apiSlice";
import authReducer from "@/redux/slices/authSlice";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
const localStorage = createWebStorage("local");

const authPersistConfig = {
  key: "auth",
  storage: localStorage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,

    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  // To avoid Redux warnings
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persister = persistStore(store);
