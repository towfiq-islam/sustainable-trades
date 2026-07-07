"use client";
import { useAddOrderNoteMutation } from "@/redux/api/ordersApi";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";

interface OrderNoteProps {
  order_id: number;
  onClose: () => void;
}

interface FormValues {
  note: string;
}

const OrderNote: React.FC<OrderNoteProps> = ({ order_id, onClose }) => {
  const [addNoteMutation, { isLoading: isPending }] = useAddOrderNoteMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await addNoteMutation(data).unwrap();
      if (res?.success) {
        toast.success(res?.message);
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 relative">
      <h5 className="text-[24px] font-semibold text-secondary-black">
        Order Note
      </h5>

      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder="Type note here..."
          className="p-3 rounded-[8px] border border-primary-red text-[16px] font-normal text-secondary-black cursor-pointer hover:border-primary-green duration-300 ease-in-out w-full mt-5 h-[280px]"
          {...register("note", {
            required: "Note is required",
          })}
        />

        {errors.note && (
          <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
        )}

        <div className="mt-5">
          <button
            type="submit"
            disabled={isPending}
            className={`auth-secondary-btn w-full ${
              isPending ? "!cursor-not-allowed opacity-85" : "cursor-pointer"
            }`}
          >
            {isPending ? (
              <p className="flex gap-2 items-center justify-center">
                <CgSpinnerTwo className="animate-spin text-xl" />
                <span>Please wait....</span>
              </p>
            ) : (
              "Save Note"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderNote;
