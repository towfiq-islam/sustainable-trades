import React from "react";
import Pricing from "@/app/(main)/_Components/Pricing";

const StepFive = ({ step, setStep }: any) => {
  return (
    <section>
      {/* Pricing */}
      <Pricing
        description="Choose What Works Best For You"
        button1="Yearly"
        button2="Monthly"
      />

      {/* Btns */}
      <div className="flex justify-between items-center">
        <button onClick={() => setStep(step - 1)} className="auth-primary-btn">
          Back
        </button>
      </div>
    </section>
  );
};

export default StepFive;
