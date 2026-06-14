"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";
import { useSendMessage } from "@/Hooks/api/chat_api";
import { useLocalPickupPro } from "@/Hooks/api/dashboard_api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type formData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ShippingOptionsProps = {
  cart_id: number | null;
  userId: any;
  fulfillmentType: string;
  membershipType: string;
  isConnected: boolean;
  onProceed: () => void;
  onSuccess: () => void;
  onClose: () => void;
};

const ShippingOptionsModal = ({
  cart_id,
  userId,
  membershipType,
  fulfillmentType,
  onProceed,
  onClose,
  isConnected,
}: ShippingOptionsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState(
    isConnected &&
      (fulfillmentType === "shipping" ||
        fulfillmentType === "arrange_local_pickup_and_shipping")
      ? "proceed"
      : "local",
  );

  const { mutate: sendMessageMutation, isPending } = useSendMessage();
  const { mutate: localPickupForPro, isPending: isPicking } =
    useLocalPickupPro(cart_id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = async (data: formData) => {
    const payload = {
      receiver_id: userId,
      type: "order",
      message: data?.message,
      cart_id,
    };

    if (membershipType === "pro") {
      return localPickupForPro(data, {
        onSuccess: (res: any) => {
          toast.success(res.message);
          queryClient.invalidateQueries("get-product-cart" as any);
          onClose();
          router.push(
            `/order-success?order_id=${res?.data?.id}&shop_id=${res?.data?.shop_id}`,
          );
        },
      });
    }

    sendMessageMutation(payload, {
      onSuccess: (res: any) => {
        toast.success(res.message);
        queryClient.invalidateQueries("get-product-cart" as any);
        onClose();
      },
    });
  };

  return (
    <>
      <h3 className="text-light-green font-semibold text-lg mb-3">
        Shipping Options
      </h3>

      {/* Dynamic Error Message */}
      {errorMessage && (
        <div className="mb-4 px-2 py-3 bg-primary-red/10 border border-primary-red rounded-lg text-primary-red text-sm">
          {errorMessage}
        </div>
      )}

      <p className="text-secondary-gray font-semibold mb-3">
        Select the option that works best for you!
      </p>

      <div className="space-y-3">
        <p
          className={`flex gap-3 items-center mb-3 ${
            fulfillmentType === "arrange_local_pickup" ||
            fulfillmentType === "Mixed"
              ? "opacity-80"
              : ""
          }`}
        >
          <input
            type="radio"
            className="scale-150"
            name="shipping"
            value="proceed"
            checked={shippingMethod === "proceed"}
            onChange={e => {
              if (
                fulfillmentType === "arrange_local_pickup" &&
                membershipType === "basic"
              ) {
                return setErrorMessage(
                  "Shipping is not available for this product. This is a Basic Membership store, so online payment and shipping through the platform are not supported. Please choose the “Arrange Local Pickup” option to contact the seller directly and collect the product.",
                );
              } else if (fulfillmentType === "arrange_local_pickup") {
                return setErrorMessage(
                  "This vendor only offers Local Pickup for this product. Please select 'Arrange Local Pickup' to continue.",
                );
              } else if (fulfillmentType === "Mixed") {
                return setErrorMessage(
                  "One or more items in your cart are only available for local pickup. You can message the seller to arrange shipping for the other item if needed, but checkout will continue with local pickup for this order. If you prefer, you can cancel and place separate orders , one for pickup and one for shipping.",
                );
              } else if (membershipType === "pro" && !isConnected) {
                return setErrorMessage(
                  "Online checkout isn’t available for this item. This listing is from a Pro Member shop, but the shop does not currently have a payment processor connected, so payments cannot be completed through the platform. Please continue with Arrange Local Pickup to coordinate directly with the seller. Some members offer local delivery, feel free to ask.",
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
            fulfillmentType === "shipping" ? "opacity-80" : ""
          }`}
        >
          <input
            type="radio"
            className="scale-150"
            name="shipping"
            value="local"
            checked={shippingMethod === "local"}
            onChange={e => {
              if (fulfillmentType === "shipping") {
                return setErrorMessage(
                  "This vendor only offers Shipping for this product. Please select 'Shipping' to continue.",
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="form-label">Name</label>
                <input
                  className="form-input"
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <span className="form-error">{errors.name.message}</span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Your email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors.email && (
                  <span className="form-error">{errors.email.message}</span>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Your phone number"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                />
                {errors.phone && (
                  <span className="form-error">{errors.phone.message}</span>
                )}
              </div>

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
                disabled={isPending || isPicking}
                className={`primary_btn ${
                  isPending || isPicking
                    ? "!cursor-not-allowed opacity-70 enabled:hover:!bg-primary-green enabled:hover:!text-white"
                    : "cursor-pointer"
                } `}
              >
                {isPending || isPicking ? (
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
