"use client";
import React from "react";
import { BackSvg, MessageSvg } from "@/Components/Svg/SvgContainer";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { CgSpinnerTwo } from "react-icons/cg";
import { useSendMessageMutation } from "@/redux/api/chatApi";

type messageProps = {
  id: number | null;
  shopInfo: {
    product_name: string;
    product_price: string;
    shop: {
      shop_name: string;
      address: {
        address_line_1: string;
      };
    };
  };
  setMsgOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface MessageFormData {
  message: string;
}

const MessageToSellerModal = ({ id, shopInfo, setMsgOpen }: messageProps) => {
  const [sendMessageMutation, { isLoading: isPending }] =
    useSendMessageMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageFormData>();

  const onSubmit = async (data: MessageFormData) => {
    const payload = {
      receiver_id: id,
      ...data,
    };

    try {
      const res = await sendMessageMutation(payload).unwrap();

      if (res?.success) {
        toast.success(data?.message);
        reset();
        setMsgOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <>
      <h3 className="text-light-green font-semibold text-lg mb-2">
        Send Message
      </h3>

      {/* Shop Name */}
      <h4 className="text-2xl font-semibold text-secondary-black mb-2">
        {shopInfo?.shop?.shop_name}
      </h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label
            htmlFor="msg"
            className="text-light-green font-semibold mb-2 block"
          >
            Message to the Seller
          </label>

          <textarea
            id="message"
            {...register("message", { required: "Message is required" })}
            className={`form-input`}
            rows={3}
            placeholder="Type message here..."
          ></textarea>

          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message as string}
            </p>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <button
            type="button"
            onClick={() => setMsgOpen(false)}
            className="primary_btn flex-1 !flex gap-2 items-center justify-center"
          >
            <BackSvg />
            <span>Go back</span>
          </button>

          <button
            type="submit"
            disabled={isPending}
            className={`primary_btn flex-1 !flex gap-2 items-center justify-center ${
              isPending
                ? "!cursor-not-allowed opacity-85 hover:!bg-primary-green hover:!text-white"
                : "cursor-pointer"
            }`}
          >
            {isPending ? (
              <span className="flex gap-2 items-center justify-center">
                <CgSpinnerTwo className="animate-spin text-xl" />
                <span>Please wait....</span>
              </span>
            ) : (
              <span className="flex gap-3 items-center">
                <MessageSvg />
                <span>Send message</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default MessageToSellerModal;
