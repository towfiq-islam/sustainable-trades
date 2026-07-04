"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";
import { useLocalPickupPro } from "@/Hooks/api/dashboard_api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSendMessageMutation } from "@/redux/api/chatApi";

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
  shippingMethod: string;
  setShippingMethod: React.Dispatch<React.SetStateAction<string>>;
  setSuccessOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SHIPPING_OPTIONS = [
  {
    value: "delivery",
    label: "Arrange Local Delivery",
    description:
      "Have your order delivered to your address by the seller or shop owner, if available in your area. You'll see the delivery fee (if applicable) at checkout.",
  },
  {
    value: "local",
    label: "Arrange Local Pickup",
    description:
      "Pick up your order from the store location. If there are multiple pickup locations, you can choose the one that works best for you. After checkout, the date and time will be arranged with the shop owner.",
  },
  {
    value: "proceed",
    label: "Proceed to Shipping",
    description:
      "Have your order shipped to your address using standard shipping. You'll see the shipping cost at checkout.",
  },
];

const CTA_LABELS: Record<string, string> = {
  delivery: "Continue with Local Delivery",
  local: "Continue with Local Pickup",
  proceed: "Continue with Shipping",
};

const ShippingOptionsModal = ({
  cart_id,
  userId,
  membershipType,
  fulfillmentType,
  onProceed,
  onClose,
  isConnected,
  shippingMethod,
  setShippingMethod,
  setSuccessOpen,
}: ShippingOptionsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [sendMessageMutation, { isLoading: isPending }] =
    useSendMessageMutation();
  const { mutate: localPickupForPro, isPending: isPicking } =
    useLocalPickupPro(cart_id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const handleOptionChange = (value: string) => {
    setErrorMessage("");

    if (value === "proceed") {
      if (
        fulfillmentType === "arrange_local_pickup" &&
        membershipType === "basic"
      ) {
        return setErrorMessage(
          "Shipping is not available for this product. This is a Basic Membership store, so online payment and shipping through the platform are not supported. Please choose the Arrange Local Pickup option to contact the seller directly and collect the product.",
        );
      }
      if (membershipType === "pro" && !isConnected) {
        return setErrorMessage(
          "Online checkout isn’t available for this item. This listing is from a Pro Member shop, but the shop does not currently have a payment processor connected, so payments cannot be completed through the platform. Please continue with Arrange Local Pickup to coordinate directly with the seller. Some members offer local delivery, feel free to ask.",
        );
      }
      if (fulfillmentType === "arrange_local_pickup") {
        return setErrorMessage(
          "This vendor only offers Local Pickup for this product. Please select 'Arrange Local Pickup' to continue.",
        );
      }
      if (
        fulfillmentType === "local_pickup" ||
        fulfillmentType === "both_local_pickup"
      ) {
        return setErrorMessage(
          "Shipping Unavailable. One or more items in your cart are only available for Local Pickup. To continue with this order, please proceed with Arrange Local Pickup. If you prefer shipping, you can contact the sellers to see if alternate arrangements are available, or place separate orders-one for Local Pickup and one for Shipping.",
        );
      }
    }

    if (value === "local" || value === "delivery") {
      if (fulfillmentType === "shipping") {
        return setErrorMessage(
          "This vendor only offers Shipping for this product. Please select 'Proceed to Shipping' to continue.",
        );
      }
      if (fulfillmentType === "both_shipping") {
        return setErrorMessage(
          "Local Pickup Unavailable. One or more items in your cart are only available for Shipping. To continue with this order, please proceed with Shipping. If you prefer, you can place separate orders-one for Local Pickup, and one for Shipping-or contact the seller to see if local pickup arrangements are available.",
        );
      }
    }

    setShippingMethod(value);
  };

  const handleCTAClick = () => {
    if (shippingMethod === "proceed") {
      onProceed();
    }
  };

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

    sendMessageMutation(payload)
      .unwrap()
      .then(res => {
        toast.success(res.message);
        onClose();
        setSuccessOpen(true);
      })
      .catch(err => {
        toast.error(err?.data?.message);
      });
  };

  const showForm = shippingMethod === "local" || shippingMethod === "delivery";
  const ctaLabel = shippingMethod ? CTA_LABELS[shippingMethod] : null;

  return (
    <>
      {/* Header */}
      <h3 className="text-light-green font-semibold text-lg mb-1">
        Shipping Options
      </h3>
      <p className="text-secondary-gray font-medium text-sm mb-3">
        Select the option that works best for you!
      </p>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 px-2 py-3 bg-primary-red/10 border border-primary-red rounded-lg text-primary-red text-sm">
          {errorMessage}
        </div>
      )}

      {/* Options */}
      <div className="divide-y divide-gray-200">
        {SHIPPING_OPTIONS.map(option => (
          <div key={option.value} className="py-5">
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="radio"
                name="shipping"
                value={option.value}
                checked={shippingMethod === option.value}
                onChange={() => handleOptionChange(option.value)}
                className="mt-1 size-4.5 accent-primary-green shrink-0 cursor-pointer"
              />
              <div>
                <p className="font-semibold text-secondary-black text-base mb-1">
                  {option.label}
                </p>
                <p className="text-secondary-gray font-medium text-sm leading-relaxed">
                  {option.description}
                </p>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Inline Schedule Pickup Form */}
      {showForm && (
        <div className="mt-2 mb-4 pt-4 border-t border-gray-200">
          <h3 className="mb-1 text-secondary-black font-semibold">
            Schedule Pickup
          </h3>
          <p className="text-secondary-black text-[15px] mb-5">
            Please provide your contact information below and send a message to
            the seller to arrange a convenient time and location for pickup.
            Some members offer local delivery, feel free to ask.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Your email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="form-label">Phone</label>
              <input
                type="number"
                className="form-input"
                placeholder="Your phone number"
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && (
                <span className="form-error">{errors.phone.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="message" className="form-label">
                Message to Seller
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="Type message here..."
                className="form-input"
                {...register("message", { required: "Message is required" })}
              />
              {errors.message && (
                <span className="form-error">{errors.message.message}</span>
              )}
            </div>

            <button
              disabled={isPending || isPicking}
              className={`primary_btn w-full ${
                isPending || isPicking
                  ? "!cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {isPending || isPicking ? (
                <span className="flex gap-2 items-center justify-center">
                  <CgSpinnerTwo className="animate-spin text-xl" />
                  <span>Please wait...</span>
                </span>
              ) : (
                "Send Message to Seller"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Bottom CTA — only for shipping/delivery */}
      {!showForm && ctaLabel && (
        <button onClick={handleCTAClick} className="primary_btn w-full mt-4">
          {ctaLabel}
        </button>
      )}
    </>
  );
};

export default ShippingOptionsModal;
