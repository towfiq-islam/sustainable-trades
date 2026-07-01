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
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
const localStorage = createWebStorage("local");

const authPersistConfig = {
  key: "auth",
  storage: localStorage,
  whitelist: ["isAuthenticated", "latitude", "longitude"],
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
