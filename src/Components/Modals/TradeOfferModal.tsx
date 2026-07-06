import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import useAuth from "@/Hooks/useAuth";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TradeOfferSkeleton } from "@/Components/Loader/Loader";
import { LocationTwoSvg, SendSvg, Reload } from "@/Components/Svg/SvgContainer";
import {
  useGetTradeShopProductQuery,
  useTradeSendOfferMutation,
} from "@/redux/api/tradeApi";
import { FaLeaf } from "react-icons/fa";
import { HiOutlineArrowPath } from "react-icons/hi2";
import Link from "next/link";
type TradeOfferModalProps = {
  id: number | null;
  productId: number | null;
  shopInfo: {
    distance_in_miles: number;
    shop: {
      user_id: number;
      shop_name: string;
      address: {
        address_line_1: string;
      };
    };
  };
  setTradeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sellingOption: boolean;
  onClose: any;
};

type TradeItem = {
  product_id: any;
  quantity: number;
};

const TradeOfferModal = ({
  id,
  productId,
  shopInfo,
  setTradeOpen,
  sellingOption,
  onClose,
}: TradeOfferModalProps) => {
  // Hook
  const { user } = useAuth();

  // States
  const [message, setMessage] = useState<string>("");
  const [offeredItems, setOfferedItems] = useState<TradeItem[]>([
    { product_id: productId, quantity: 1 },
  ]);
  const [requestedItems, setRequestedItems] = useState<TradeItem[]>([
    { product_id: null, quantity: 1 },
  ]);

  // Mutation
  const [sendTradeOfferMutation, { isLoading: isPending }] =
    useTradeSendOfferMutation();

  // Receiver trades
  const { data: tradeProducts, isLoading: tradeLoading } =
    useGetTradeShopProductQuery(id, {
      skip: !sellingOption,
    });

  // Sender trades
  const { data: myTradeProducts, isLoading: myTradeLoading } =
    useGetTradeShopProductQuery(user?.shop_info?.id);

  // Loader
  // if (tradeLoading || myTradeLoading) {
  //   return <TradeOfferSkeleton />;
  // }

  // Func for send offer
  const handleSendOffer = () => {
    const invalidOffered = offeredItems.some(
      item => !item.product_id || item.quantity < 1,
    );

    const invalidRequested = requestedItems.some(
      item => !item.product_id || item.quantity < 1,
    );

    if (invalidOffered) {
      return toast.error(
        "Please select a valid product and quantity in offered items",
      );
    }

    if (invalidRequested) {
      return toast.error(
        "Please select a valid product and quantity in requested items",
      );
    }

    const payload = {
      receiver_id: shopInfo?.shop?.user_id,
      message: message,
      offered_items: offeredItems,
      requested_items: requestedItems,
    };

    sendTradeOfferMutation(payload)
      .unwrap()
      .then(res => {
        toast.success(res?.message);
        setTradeOpen(false);
      })
      .catch(err => {
        toast.error(err?.data?.message);
      });
  };

  return (
    <>
      {sellingOption ? (
        <div className="text-center">
          {/* Top Icon */}
          <div className="mx-auto flex size-18 items-center justify-center rounded-full bg-[#D8F1EC]">
            <HiOutlineArrowPath size={36} className="text-[#123A34]" />
          </div>

          {/* Title */}
          <h2 className="mt-4 text-[28px] font-semibold leading-tight text-primary-green">
            This Listing Is Available for <br /> Trade &amp; Barter Only
          </h2>

          {/* Divider */}
          <div className="my-4 flex items-center justify-center gap-4">
            <div className="h-[2px] flex-1 bg-[#D6ECE6]" />
            <FaLeaf className="text-[#93BCAF]" size={18} />
            <div className="h-[2px] flex-1 bg-[#D6ECE6]" />
          </div>

          {/* Description */}
          <p className="leading-7 text-[#1F1F1F]">
            This item is not currently available for purchase. The seller has
            chosen to offer this listing exclusively through Sustainable Trades'
            Trade &amp; Barter system. Trade &amp; Barter is available to
            Sustainable Trades members with active shops and listings. Please
            contact the seller if you have any questions.
          </p>

          {/* Primary Button */}
          <Link
            href={"/auth/create-shop"}
            className="mt-8 flex h-13 w-full items-center justify-center gap-3 rounded-lg bg-primary-green font-medium text-white transition hover:bg-[#18453E] cursor-pointer"
          >
            <FaLeaf size={18} />
            Create a Sustainable Shop &amp; Start Trading
          </Link>

          {/* Secondary Button */}
          <button
            onClick={onClose}
            className="mt-4 h-12 w-full rounded-lg border border-primary-green/10 bg-[#D8F1EC] font-medium text-primary-green transition cursor-pointer"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          {tradeLoading || myTradeLoading ? (
            <TradeOfferSkeleton />
          ) : (
            <div>
              <h3 className="text-light-green font-semibold text-lg md:mb-2">
                Trade Offer
              </h3>

              {/* Shop Name */}
              <h4 className="text-xl md:text-2xl font-semibold text-secondary-black mb-2">
                {shopInfo?.shop?.shop_name}
              </h4>

              {/* Shop Review */}
              <div className="flex gap-1 items-center mb-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <FaStar key={index} className="text-primary-green text-sm" />
                ))}
              </div>

              {/* Shop Location */}
              <div className="flex gap-1 items-center mb-3">
                <LocationTwoSvg />
                <span className="text-light-green">
                  {shopInfo?.distance_in_miles.toFixed(2)} mi
                </span>
              </div>

              {/* ---------- My Offer Section ---------- */}
              <div className="border border-gray-200 shadow rounded-xl p-3 mb-4">
                {offeredItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row items-center gap-3 mb-3"
                  >
                    <select
                      value={item?.product_id}
                      onChange={e => {
                        const updated = [...offeredItems];
                        updated[index].product_id = Number(e.target.value);
                        setOfferedItems(updated);
                      }}
                      className="border border-gray-300 rounded-md p-2 w-full md:w-[370px] truncate"
                    >
                      <option value="">Select Product</option>
                      {tradeProducts?.data.map((p: any) => (
                        <option key={p?.id} value={p?.id}>
                          {p?.product_name?.length > 50
                            ? `${p?.product_name?.slice(0, 50)}...`
                            : p?.product_name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => {
                        const updated = [...offeredItems];
                        updated[index].quantity = Number(e.target.value);
                        setOfferedItems(updated);
                      }}
                      className="border border-gray-300 rounded-md p-2 w-full md:w-20 text-center shrink-0"
                    />

                    <input
                      className="border border-gray-300 rounded-md p-2 w-full md:w-24 text-center shrink-0"
                      value={
                        (tradeProducts?.data?.find(
                          (p: any) => p?.id === item.product_id,
                        )?.product_price || 0) * item.quantity
                      }
                      readOnly
                    />

                    <button
                      onClick={() => {
                        const updated = offeredItems.filter(
                          (_, i) => i !== index,
                        );
                        setOfferedItems(updated);
                      }}
                      className="cursor-pointer"
                    >
                      <RiDeleteBin6Line className="text-red-600 text-2xl shrink-0" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setOfferedItems([
                      ...offeredItems,
                      { product_id: null, quantity: 1 },
                    ])
                  }
                  className="text-light-green text-sm hover:underline cursor-pointer"
                >
                  + Add another product/service
                </button>
              </div>

              {/* hr */}
              <div className="flex gap-x-5 items-center mb-2 md:my-4">
                <div className="bg-[#BFBEBE] w-full h-[1px]"></div>
                <div className="inline-block">
                  <Reload className="cursor-pointer transform transition-transform hover:rotate-180 duration-500 ease-in-out" />
                </div>
                <div className="bg-[#BFBEBE] w-full h-[1px]"></div>
              </div>

              {/* ---------- Their Offer Section ---------- */}
              <div className="border border-gray-200 shadow rounded-xl p-3 mb-5">
                {requestedItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row items-center gap-3 mb-3"
                  >
                    <select
                      value={item?.product_id || ""}
                      onChange={e => {
                        const updated = [...requestedItems];
                        updated[index].product_id = Number(e.target.value);
                        setRequestedItems(updated);
                      }}
                      className="border border-gray-300 rounded-md p-2 w-full md:w-[370px] truncate"
                    >
                      <option value="">Select Product</option>
                      {myTradeProducts?.data.map((p: any) => (
                        <option key={p?.id} value={p?.id}>
                          {p?.product_name?.length > 50
                            ? `${p?.product_name?.slice(0, 50)}...`
                            : p?.product_name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => {
                        const updated = [...requestedItems];
                        updated[index].quantity = Number(e.target.value);
                        setRequestedItems(updated);
                      }}
                      className="border border-gray-300 rounded-md p-2 w-full md:w-20 text-center shrink-0"
                    />

                    <input
                      className="border border-gray-300 rounded-md p-2 w-full md:w-24 text-center shrink-0"
                      value={
                        (myTradeProducts?.data?.find(
                          (p: any) => p?.id === item.product_id,
                        )?.product_price || 0) * item.quantity
                      }
                      readOnly
                    />

                    <button
                      onClick={() => {
                        const updated = requestedItems.filter(
                          (_, i) => i !== index,
                        );
                        setRequestedItems(updated);
                      }}
                      className="cursor-pointer"
                    >
                      <RiDeleteBin6Line className="text-red-600 text-2xl shrink-0" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setRequestedItems([
                      ...requestedItems,
                      { product_id: null, quantity: 1 },
                    ])
                  }
                  className="text-light-green text-sm hover:underline cursor-pointer"
                >
                  + Add another product/service
                </button>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="msg"
                  className="text-light-green font-semibold mb-2 block"
                >
                  Message to the Seller
                </label>

                <textarea
                  id="msg"
                  className="border border-gray-300 rounded-md p-2 w-full block"
                  rows={3}
                  placeholder="Type message here..."
                  onChange={e => setMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setTradeOpen(false)}
                  className="w-full py-1.5 md:py-3 hover:bg-primary-green hover:text-accent-white text-[14px] font-semibold md:text-[17px] duration-300 transition-all hover:scale-[0.97] rounded-lg shadow cursor-pointer bg-transparent text-primary-green border-2 border-primary-green text-center flex-1"
                >
                  Cancel
                </button>

                <button
                  disabled={isPending}
                  onClick={handleSendOffer}
                  className={`primary_btn flex-1 ${
                    isPending ? "!cursor-not-allowed" : "!cursor-pointer"
                  }`}
                >
                  {isPending ? (
                    <span className="flex gap-2 items-center justify-center">
                      <CgSpinnerTwo className="animate-spin text-lg" />
                      <span>Sending....</span>
                    </span>
                  ) : (
                    <span className="flex gap-2 items-center justify-center">
                      <SendSvg />
                      <span>Send offer</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TradeOfferModal;
