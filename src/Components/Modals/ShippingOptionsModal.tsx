"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";
import { useSendMessage } from "@/Hooks/api/chat_api";

type formData = {
  message: string;
};

type ShippingOptionsProps = {
  userId: any;
  fulfillmentType: string;
  onProceed: () => void;
  onSuccess: () => void;
  onClose: () => void;
};

const ShippingOptionsModal = ({
  userId,
  fulfillmentType,
  onProceed,
  onClose,
}: ShippingOptionsProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState(
    fulfillmentType === "Shipping" ||
      fulfillmentType === "Arrange Local Pickup and Shipping"
      ? "proceed"
      : "local"
  );

  const { mutate: sendMessageMutation, isPending } = useSendMessage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = async (data: formData) => {
    setShippingMethod("");
    const payload = {
      receiver_id: userId,
      type: "order",
      ...data,
    };

    await sendMessageMutation(payload, {
      onSuccess: (data: any) => {
        if (data?.success) {
          toast.success(data?.message);
          onClose();
        }
      },
    });
    // onSuccess();
  };

  return (
    <>
      <h3 className="text-light-green font-semibold text-lg mb-3">
        Shipping Options
      </h3>

      {/* Dynamic Error Message */}
      {errorMessage && (
        <div className="mb-4 px-2 py-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
          {errorMessage}
        </div>
      )}

      <p className="text-secondary-gray font-semibold mb-3">
        Select the option that works best for you!
      </p>

      <div className="space-y-3">
        <p
          className={`flex gap-3 items-center mb-3 ${
            fulfillmentType === "Arrange Local Pickup" ? "opacity-80" : ""
          }`}
        >
          <input
            type="radio"
            className="scale-150"
            name="shipping"
            value="proceed"
            checked={shippingMethod === "proceed"}
            onChange={e => {
              if (fulfillmentType === "Arrange Local Pickup") {
                return setErrorMessage(
                  "This vendor only offers Local Pickup for this product. Please select 'Arrange Local Pickup' to continue."
                );
              } else if (fulfillmentType === "Both") {
                return setErrorMessage(
                  "One or more items in your cart are only available for local pickup. You can message the seller to arrange shipping for the other item if needed, but checkout will continue with local pickup for this order. If you prefer, you can cancel and place separate orders , one for pickup and one for shipping."
                );
              }
              setShippingMethod(e.target.value);
            }}
          />

          <span className="text-secondary-gray font-semibold">
            Proceed to Shipping
          </span>
        </p>

        {shippingMethod === "proceed" && (
          <button onClick={onProceed} className="primary_btn">
            Proceed to Shipping
          </button>
        )}

        <p
          className={`flex gap-3 items-center mb-3 ${
            fulfillmentType === "Shipping" ? "opacity-80" : ""
          }`}
        >
          <input
            type="radio"
            className="scale-150"
            name="shipping"
            value="local"
            checked={shippingMethod === "local"}
            onChange={e => {
              if (fulfillmentType === "Shipping") {
                return setErrorMessage(
                  "This vendor only offers Shipping for this product. Please select 'Shipping' to continue."
                );
              }
              setShippingMethod(e.target.value);
            }}
          />

          <span className="text-secondary-gray font-semibold">
            Arrange Local Pickup
          </span>
        </p>

        {shippingMethod === "local" && (
          <div>
            <h3 className="mb-1 text-secondary-black font-semibold">
              Schedule Pickup
            </h3>
            <p className="text-secondary-black text-[15px] mb-5">
              Schedule Pickup Please provide your contact information below and
              send a message to the seller to arrange a convenient time and
              location for pickup.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Message */}
              <div>
                <label htmlFor="message" className="form-label">
                  Message to Seller
                </label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Type message here..."
                  className="form-input"
                  {...register("message", {
                    required: "Message is required",
                  })}
                ></textarea>
                {errors.message && (
                  <span className="form-error">{errors.message.message}</span>
                )}
              </div>

              {/* Submit btn */}
              <button
                disabled={isPending}
                className={`primary_btn ${
                  isPending
                    ? "!cursor-not-allowed opacity-85 hover:!bg-primary-green hover:!text-white"
                    : "cursor-pointer"
                } `}
              >
                {isPending ? (
                  <span className="flex gap-2 items-center justify-center">
                    <CgSpinnerTwo className="animate-spin text-xl" />
                    <span>Please wait....</span>
                  </span>
                ) : (
                  "Send Message to Seller"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default ShippingOptionsModal;
