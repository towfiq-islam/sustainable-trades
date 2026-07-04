"use client";
import { store, persister } from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        {children}
      </PersistGate>
    </Provider>
  );
}
