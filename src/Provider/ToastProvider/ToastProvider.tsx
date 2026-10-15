import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        zIndex: 99999,
      }}
      toastOptions={{
        duration: 2000,
        style: {
          background: "var(--color-accent-white)",
          color: "var(--color-secondary-black)",
          border: "1px solid var(--color-light-gray)",
          borderRadius: "8px",
          padding: "14px 16px",
          fontSize: "15px",
          fontWeight: "600",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)",
        },

        success: {
          iconTheme: {
            primary: "var(--color-primary-green)",
            secondary: "var(--color-pure-white)",
          },
        },

        error: {
          iconTheme: {
            primary: "var(--color-primary-red)",
            secondary: "var(--color-pure-white)",
          },
        },
      }}
    />
  );
}
