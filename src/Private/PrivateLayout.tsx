"use client";
import React, { useEffect } from "react";
import useAuth from "@/Hooks/useAuth";
import { useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (
      (!loading && !isAuthenticated && !user) ||
      (user?.role === "vendor" && !user?.membership)
    ) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <PuffLoader color="#274f45" />
      </div>
    );
  }

  if (isAuthenticated || user) {
    return <>{children}</>;
  }

  return null;
};

export default PrivateLayout;
