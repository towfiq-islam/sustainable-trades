"use client";
import React from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { CgSpinnerTwo } from "react-icons/cg";
import { useFollowShop } from "@/Hooks/api/cms_api";

type shopItem = {
  shop: {
    id: number;
    shop_name: string;
    is_followed: boolean;
    address: {
      address_line_1: string;
      address_10_mile: string;
      display_my_address: string;
      city: string;
      state: string;
    };
    user: {
      avatar: string;
      first_name: string;
      last_name: string;
    };
  };
};

interface shopProps {
  data: shopItem;
}

const ShopInfo = ({ data }: shopProps) => {
  // Hook
  const { user } = useAuth();

  // Mutation
  const { mutate: followShopMutation, isPending } = useFollowShop(
    data?.shop?.id,
  );

  // Func for follow shop
  const handleFollowShop = () => {
    if (!user) {
      return toast.error("Please login first");
    }
    followShopMutation();
  };

  return (
    <>
      <div className="flex gap-4 items-center mb-7">
        <figure className="size-14 rounded-full relative bg-gray-200 grid place-items-center text-xl uppercase font-semibold">
          {data?.shop?.user?.avatar ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/${data?.shop?.user?.avatar}`}
              alt="author"
              fill
              unoptimized
              className="size-full rounded-full"
            />
          ) : (
            <span>{data?.shop?.user?.first_name?.at(0)}</span>
          )}
        </figure>

        <div>
          <h3 className="font-semibold text-xl">
            {data?.shop?.user?.first_name} {data?.shop?.user?.last_name}
          </h3>
          <p className="text-secondary-gray">{data?.shop?.shop_name}</p>
        </div>
      </div>

      <button
        onClick={handleFollowShop}
        className="bg-accent-blue md:text-xl font-semibold flex gap-3 items-center text-primary-green px-5 py-2 rounded-lg cursor-pointer hover:scale-95 transition-transform duration-500"
      >
        {isPending ? (
          <p className="flex gap-2 items-center justify-center">
            <CgSpinnerTwo className="animate-spin text-xl" />
            <span>Please wait...</span>
          </p>
        ) : data?.shop?.is_followed ? (
          "Unfollow Shop"
        ) : (
          "Follow Shop"
        )}
      </button>
    </>
  );
};

export default ShopInfo;
