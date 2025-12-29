"use client";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { useState } from "react";
import DashBoardHeader from "@/Components/Common/DashBoardHeader";
import { getMyOrders } from "@/Hooks/api/dashboard_api";
import OrderCardSkeleton from "@/Components/Loader/Loader";

type ProductImg = {
  image: string;
};

type SingleItem = {
  product: {
    product_name: string;
    product_price: string;
    images: ProductImg[];
  };
};

type orderItem = {
  id: number;
  created_at: string;
  total_amount: string;
  status: string;
  order_number: string;
  shop: {
    shop_name: string;
    user: {
      membership: {
        user_id: number;
        membership_type: string;
      };
    };
  };
  order_items: SingleItem[];
};

const page = () => {
  const [isActive, setIsActive] = useState("orders");
  const [status, setStatus] = useState<string>("");
  const tabs = ["orders", "pending", "confirmed", "delivered", "cancelled"];
  const { data: myOrders, isLoading } = getMyOrders(status);
  console.log(myOrders?.data);

  return (
    <section>
      <DashBoardHeader heading="Yours Orders" placeholder="Search Orders" />

      <ul className="flex flex-wrap md:flex-nowrap gap-2 lg:gap-x-6 py-6">
        {tabs?.map((tab: string, index: number) => (
          <li
            key={tab}
            onClick={() => {
              setIsActive(tab);
              setStatus(tab === "orders" ? "" : tab);
            }}
            className={`text-[15px] lg:text-[20px] font-bold text-[#000] px-3 md:px-6 py-2 w-fit flex-1 text-nowrap cursor-pointer capitalize ${
              isActive === tab
                ? "border-b-[3px] border-[#77978F]"
                : "border-b border-[#BFBEBE]"
            } ${index === tabs.length - 1 ? "flex-1" : "sm:shrink-0"}`}
          >
            {tab}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-6">
        {isLoading ? (
          [1, 2, 3]?.map((_, idx) => <OrderCardSkeleton key={idx} />)
        ) : myOrders?.data?.length > 0 ? (
          myOrders?.data?.map((order: orderItem) => (
            <div
              key={order?.id}
              className="border border-[#BFBEBE] rounded-[8px]"
            >
              <div className="px-3 md:px-6 py-2 md:py-4">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-10">
                    <div>
                      <h3 className="text-[#67645F] font-sans font-bold">
                        Order Placed
                      </h3>
                      <p className="font-sans font-normal text-[#000] text-[16px]">
                        {moment(order?.created_at).format("LL")}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-[#67645F] font-sans font-bold">
                        Total
                      </h3>
                      <p className="font-sans font-normal text-[#000] text-[16px]">
                        ${order?.total_amount}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-[#67645F] font-sans font-bold  mb-1">
                        Status
                      </h3>
                      <p
                        className={`font-sans font-normal text-white px-3 text-sm py-1 rounded-lg capitalize ${
                          order?.status === "delivered"
                            ? "bg-primary-green"
                            : order?.status === "pending"
                            ? "bg-accent-red"
                            : order?.status === "pending"
                            ? "bg-blue-500"
                            : order?.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {order?.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex  flex-col sm:flex-row gap-2 sm:gap-x-10">
                    <div>
                      <h3 className="text-[#67645F] font-sans font-bold">
                        Order Number
                      </h3>
                      <p className="font-sans font-normal text-[#000] text-[16px]">
                        {order?.order_number}
                      </p>
                    </div>

                    <button className="text-[#1F4038] font-sans font-bold underline cursor-pointer">
                      View Invoice
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full bg-[#BFBEBE] h-[1px]" />

              <div className="pt-2 px-4 pb-4">
                <div className="flex flex-col gap-2.5 sm:gap-0 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h4 className="text-[16px] sm:text-[20px] font-bold text-[#000]">
                      {order?.shop?.shop_name}
                    </h4>

                    <p className="font-sans font-normal text-[#000] text-[13px] sm:text-[16px] pt-2 pb-3">
                      Your package was left near the front door or porch.
                    </p>

                    {order?.order_items?.map(item => (
                      <div className="flex gap-x-3 mb-3">
                        <figure className="rounded size-[90px]">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.product?.images[0]?.image}`}
                            alt="order_img"
                            height={117}
                            width={115}
                            unoptimized
                            className="rounded size-full object-cover"
                          />
                        </figure>
                        <div className="flex flex-col gap-3">
                          <h5 className="text-[16px] sm:text-[20px] font-bold text-[#000]">
                            {item?.product?.product_name}
                          </h5>
                          <h5 className="text-[#222]">
                            Price: ${item?.product?.product_price}
                          </h5>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 ">
                    <button className="p-2 rounded-[8px] border border-[#BFBEBE] text-[13px] md:text-[16px] font-normal  text-[#000] cursor-pointer  w-full sm:w-[250px]  hover:scale-105 duration-500 ease-in-out">
                      Track Package
                    </button>

                    <Link
                      href={``}
                      className="p-2 rounded-[8px] border border-[#BFBEBE] text-[13px] md:text-[16px] font-normal  text-[#000] cursor-pointer text-center w-full sm:w-[250px]  hover:scale-105 duration-500 ease-in-out"
                    >
                      View Order
                    </Link>

                    <Link
                      href={`/dashboard/${order?.shop?.user?.membership?.membership_type}/messages/inbox/${order?.shop?.user?.membership?.user_id}`}
                      className="p-2 rounded-[8px] border border-[#BFBEBE] text-[13px] md:text-[16px] font-normal text-[#000] cursor-pointer w-full sm:w-[250px] text-center hover:scale-105 duration-500 ease-in-out"
                    >
                      Get Help
                    </Link>

                    <Link href={`/dashboard/customer/reviews/${order?.id}`}>
                      <button className="p-2 rounded-[8px] border border-[#BFBEBE] text-[13px] md:text-[16px] font-normal  text-[#000] cursor-pointer w-full sm:w-[250px] hover:scale-105 duration-500 ease-in-out">
                        Write a Review
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-red-500 font-semibold text-lg">No Orders Found</p>
        )}
      </div>
    </section>
  );
};

export default page;
