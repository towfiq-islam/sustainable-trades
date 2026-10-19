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

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
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
