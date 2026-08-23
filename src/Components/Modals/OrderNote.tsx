"use client";
import { useAddOrderNoteMutation } from "@/redux/api/ordersApi";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";

interface OrderNoteProps {
  order_id: number;
  onClose: () => void;
  note: string;
}

interface FormValues {
  note: string;
}

const OrderNote: React.FC<OrderNoteProps> = ({ order_id, onClose, note }) => {
  const [addNoteMutation, { isLoading: isPending }] = useAddOrderNoteMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await addNoteMutation({ id: order_id, data }).unwrap();
      toast.success(res?.message);
      onClose();
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
          defaultValue={note}
          className="p-3 rounded-[8px] border border-gray-300 text-secondary-black outline-none hover:border-off-green duration-300 ease-in-out w-full mt-3 h-[230px]"
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
