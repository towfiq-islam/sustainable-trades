"use client";

import { useForm } from "react-hook-form";
import { CartItem } from "@/redux/slices/cartSlice";

type Props = {
  vendor: CartItem;
};

export default function PickupCheckout({ vendor }: Props) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(vendor.vendor_id, data);
  };

  return (
    <div className="border rounded-xl p-5 bg-white">
      <h3 className="text-lg font-semibold mb-5">
        Arrange Local Pickup - {vendor.shop_name}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          placeholder="Name"
          className="form-input"
        />

        <input
          {...register("email")}
          placeholder="Email"
          className="form-input"
        />

        <input
          {...register("phone")}
          placeholder="Phone"
          className="form-input"
        />

        <textarea
          {...register("message")}
          rows={4}
          className="form-input"
          placeholder="Message to seller"
        />

        <button className="primary_btn">Send Message</button>
      </form>
    </div>
  );
}
