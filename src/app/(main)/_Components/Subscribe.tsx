"use client";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { useNewsletter } from "@/Hooks/api/cms_api";
import Container from "@/Components/Common/Container";

const Subscribe = () => {
  const [email, setEmail] = useState<string>("");
  const { mutate: newsletterMutation, isPending } = useNewsletter();

  return (
    <section className="pb-10 md:pb-28">
      <Container>
        <h2 className="section_title  text-center !mb-4 md:!mb-7">
          Stay Loop’d on the Eco-Front!
        </h2>

        <p className="text-center text-base md:text-xl text-primary-green mb-4 md:mb-8 max-w-[700px] mx-auto">
          Subscribe to our newsletter to receive weekly updates on the latest
          goods, trade opportunities, and sustainable living tips.
        </p>

        <div className="flex gap-2.5 md:gap-5 flex-col md:flex-row justify-center items-center mb-8">
          <input
            type="text"
            onChange={e => setEmail(e.target.value)}
            placeholder="email@sustainabletrades.com"
            className="outline-none border md:border-2 border-primary-green px-3 py-1.5 md:py-3 rounded-lg w-full md:w-[400px]"
          />

          <button
            disabled={isPending}
            onClick={() => {
              if (!email) {
                return toast.error("Please enter your email");
              } else {
                newsletterMutation({ email });
              }
            }}
            className={`shrink-0 border-2 border-primary-green text-accent-white bg-primary-green font-semibold px-7 py-1.5 md:py-3 rounded-lg hover:scale-105 duration-300 transition-transform ${
              isPending ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isPending ? (
              <p className="flex gap-2 items-center justify-center">
                <CgSpinnerTwo className="animate-spin text-xl" />
                <span>Subscribing...</span>
              </p>
            ) : (
              "Subscribe"
            )}
          </button>
        </div>

        <p className="text-center md:text-lg text-primary-green max-w-[500px] mx-auto">
          By subscribing you agree to with our Privacy Policy and provide
          consent to receive updates from our company.
        </p>
      </Container>
    </section>
  );
};

export default Subscribe;
