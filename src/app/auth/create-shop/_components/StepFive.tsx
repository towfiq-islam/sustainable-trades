"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/Hooks/useAuth";
import Pricing from "@/app/(main)/_Components/Pricing";

const StepFive = () => {
  const { clearAuthorization } = useAuth();
  const router = useRouter();

  useEffect(() => {
    window.history.pushState({ step: 5 }, "", window.location.href);

    const handlePopState = () => {
      clearAuthorization();
      router.replace("/");
    };

    const handleBeforeUnload = () => {
      clearAuthorization();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [clearAuthorization, router]);

  return (
    <Pricing
      description="Choose What Works Best For You"
      button1="Yearly"
      button2="Monthly"
    />
  );
};

export default StepFive;
