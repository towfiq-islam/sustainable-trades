import useAuth from "@/Hooks/useAuth";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  response => response,

  async error => {
    const status = error?.response?.status;
    const { clearAuthorization } = useAuth();

    if (status === 401 || status === 403) {
      clearAuthorization();
      console.log("Unauthenticated. Redirecting to login...");
    }

    return Promise.reject(error);
  },
);
