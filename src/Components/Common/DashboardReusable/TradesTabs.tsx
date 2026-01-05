"use client";
import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaAnglesRight } from "react-icons/fa6";
import Image, { type StaticImageData } from "next/image";
import { Reload } from "@/Components/Svg/SvgContainer";
import moment from "moment";
import { totalAmount } from "@/helper/useTotalAmount";
import { useApproveTrade, useCancel } from "@/Hooks/api/dashboard_api";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export type TradeItem = {
  image: StaticImageData | string;
  product: productInfo;
  store: string;
  quantity: string;
  totalAmount: number;
};

export type shopData = {
  id: Number;
  shop_name: String;
  user_id: Number;
};

export type productInfo = {
  description: string;
  id: number;
  product_name: string;
  product_price: number;
  images: ImageArr[];
  shop: shopData;
};

export type ImageArr = {
  id: number;
  image: string;
  product_id: number;
};

export type TradeRequest = {
  id: number;
  created_at: string;
  inquiry: number;
  status: "pending" | "sent" | "accepted" | "cancelled";
  items: TradeItem[];
  sender_id: number;
};

type TradesTabsProps = {
  tradeRequests: TradeRequest[];
};

const actionButtons: Record<TradeRequest["status"], string[]> = {
  pending: ["Approve", "Deny", "Counter", "Message"],
  sent: ["Message"],
  accepted: ["Message", "Write A review"],
  cancelled: ["Message"],
};
const actionButtonStyles: Record<
  string,
  { bg?: string; border?: string; text: string }
> = {
  Approve: {
    bg: "bg-[#274F45]",
    text: "text-white",
  },
  Deny: { border: "border-[#8B200C]", text: "text-[#8B200C]" },
  Counter: {
    bg: "bg-[#E48872]",
    text: "text-black",
    border: "border-[#E48872]",
  },
  Message: { border: "border-gray-200", text: "text-black" },
  "Write A review": {
    bg: "bg-[#5B867B]",
    text: "text-white",
    border: "border-[#5B867B]",
  },
};

const TradesTabs: React.FC<TradesTabsProps> = ({ tradeRequests }) => {
  const { user } = useAuth();

  console.log(user);

  const router = useRouter();
  const approveTradeMutation = useApproveTrade();
  const cancleTradeMutation = useCancel();
  const queryClient = useQueryClient();
  const handleTrade = (btn: any, id: any) => {
    if (btn === "Approve") {
      approveTradeMutation.mutate(id, {
        onSuccess: (data: any) => {
          toast.success(data?.message);
          queryClient.invalidateQueries({
            queryKey: ["get-trades"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get-count"],
          });
        },
        onError: (error) => {
          toast.error("This is not your offer");
        },
      });
    }
    if (btn === "Deny") {
      cancleTradeMutation.mutate(id, {
        onSuccess: (data: any) => {
          toast.success(data?.message);
          queryClient.invalidateQueries({
            queryKey: ["get-trades"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get-count"],
          });
        },
        onError: (error: any) => {
          toast.error("This is not your offer");
        },
      });
    }
  };
  return (
    <>
      {tradeRequests?.length === 0 ? (
        <p className="text-center mt-5 h-[300px]">No Offered Found</p>
      ) : (
        <div className="h-[600px] overflow-y-auto mt-2 sm:p-6 flex flex-col gap-6">
          {tradeRequests?.map((trade) => (
            <div
              key={trade.id}
              className="border border-[#BFBEBE] p-3 md:p-6 rounded-[8px] flex flex-col gap-4"
            >
              <div className="flex flex-col gap-3.5 sm:gap-0 sm:flex-row justify-between pb-4 border-b border-[#BFBEBE]">
                <div className="flex flex-wrap sm:flex-nowrap  gap-x-5 items-center">
                  <h3 className="font-semibold text-[16px] text-[#274F45]">
                    Trade Request
                  </h3>
                  <h4 className="font-semibold text-[16px] text-[#A7A39C]">
                    {moment(trade.created_at).format("MMMM Do YYYY, h:mm:ss a")}
                  </h4>
                  <h5 className="font-semibold text-[16px] text-[#A7A39C]">
                    Inquiry # {trade.inquiry}
                  </h5>
                </div>
                <button
                  className={`px-2 py-1 rounded-[8px] min-w-[100px] inline-block  cursor-pointer ${
                    trade.status === "pending"
                      ? "bg-[#E48872] text-white"
                      : trade.status === "sent"
                      ? "bg-blue-500"
                      : trade.status === "accepted"
                      ? "bg-[#B0DEDB] text-black"
                      : "bg-[#8B200C] text-white"
                  }`}
                >
                  {trade.status}
                </button>
              </div>

              {trade?.items?.map((item, idx) => (
                <div key={idx}>
                  <div className=" flex justify-between items-end">
                    <div className="flex flex-col sm:flex-row gap-x-5 sm:gap-x-10">
                      {item.product?.images?.map((img) => (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SITE_URL}/${img?.image}`}
                          alt={item?.product?.product_name}
                          height={100}
                          width={100}
                          className="h-[100px] object-cover rounded-md"
                        />
                      ))}

                      <div className="flex flex-col">
                        <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#13141D]">
                          {item?.product?.product_name}
                        </h3>
                        <h4 className="text-[16px] sm:text-[20px] font-normal text-[#4B4A47]">
                          {item?.product?.shop?.shop_name}
                        </h4>
                        <h5 className="text-[#13141D] font-normal text-[13px] sm:text-[16px] mt-3">
                          Qty: {item?.quantity}
                        </h5>
                      </div>
                    </div>
                    <h2 className="text-[16px] sm:text-[20px]  font-normal text-[#4B4A47]">
                      Total amount:{" "}
                      <span className="font-semibold text-[#13141D]">
                        $
                        {totalAmount(
                          +item?.quantity,
                          +item?.product?.product_price
                        )}
                      </span>
                    </h2>
                  </div>

                  {idx < trade.items.length - 1 && (
                    <div className="flex gap-x-5 items-center mt-4 mb-2">
                      <div className="bg-[#BFBEBE] w-full h-[1px]"></div>
                      <div className="inline-block">
                        <Reload className="cursor-pointer transform transition-transform hover:rotate-180 duration-500 ease-in-out" />
                      </div>
                      <div className="bg-[#BFBEBE] w-full h-[1px]"></div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-wrap gap-3.5 md:gap-0 justify-between items-end border-t border-[#BFBEBE] pt-3">
                <div className="flex gap-2.5 md:gap-5 flex-wrap">
                  {actionButtons[trade.status]
                    ?.filter((btn) => {
                      if (btn === "Approve" && trade?.sender_id === user?.id)
                        return false;
                      return true;
                    })
                    .map((btn, i) => {
                      const style = actionButtonStyles[btn] || {
                        bg: "bg-gray-200",
                        border: "border-gray-400",
                        text: "text-black",
                      };

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (btn === "Counter") {
                              router.push(
                                `/dashboard/${user?.membership?.membership_type}/trades/counter/${trade?.id}`
                              );
                            } else {
                              handleTrade(btn, trade?.id);
                            }
                          }}
                          className={`relative cursor-pointer py-[10px] border px-4 rounded-md font-lato font-semibold overflow-hidden
          hover:scale-110 duration-500 ease-in-out
          ${style.bg || ""} ${style.border || "border-2"} ${style.text}
        `}
                        >
                          <span className="relative z-10">{btn}</span>
                        </button>
                      );
                    })}
                </div>
                {/* <Link href={`/dashboard/basic/trades/${trade.id}`}>
                  <div className="bg-gray-200 px-3 py-2 cursor-pointer flex items-center justify-center">
                    <FaAnglesRight />
                  </div>
                </Link> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TradesTabs;
