"use client";
import { useRouter } from "next/navigation";
import CounterBottom from "./CounterBottom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaRegStar, FaStar } from "react-icons/fa";
import { LocationSvg1, Reload } from "@/Components/Svg/SvgContainer";
import {
  useCancel,
  useCancelTrade,
  useSingleTradeOffer,
  useTradeSendProduct,
  useTradeShopProduct,
} from "@/Hooks/api/dashboard_api";
import useAuth from "@/Hooks/useAuth";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { FaRegTrashAlt } from "react-icons/fa";

const CounterTrades = ({ id }: any) => {
  const [selectedProducts, setSelectedProducts] = useState<
    Record<number, number>
  >({});
  const router = useRouter();
  const { user } = useAuth();

  const { data } = useSingleTradeOffer(id);

  console.log(data);

  // API mutation
  const { mutate, isLoading } = useTradeSendProduct(id);

  const isUserSender =
    data?.data?.sender?.shop_info?.id === user?.shop_info?.id;

  // my shopId find
  const myShopId = isUserSender
    ? data?.data?.sender?.shop_info?.id
    : data?.data?.receiver?.shop_info?.id;

  // other shopId
  const otherShopId = isUserSender
    ? data?.data?.receiver?.shop_info?.id
    : data?.data?.sender?.shop_info?.id;

  const { data: offerShopProduct } = useTradeShopProduct(myShopId);

  const { data: requestedShopProduct } = useTradeShopProduct(otherShopId);

  const queryClient = useQueryClient();
  const cancleTradeMutation = useCancel();

  // selected product

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [addonProducts, setAddonProducts] = useState<
    Record<number, { productId: number; quantity: number }[]>
  >({});

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data?.data?.items) {
      const initialSelections: Record<number, number> = {};
      const initialQuantities: Record<number, number> = {};
      data.data.items.forEach((item: any) => {
        initialSelections[item.id] = item?.product?.id;
        initialQuantities[item.id] = item?.quantity || 1;
      });
      setSelectedProducts(initialSelections);
      setQuantities(initialQuantities);
    }
  }, [data]);

  // main product quantity
  const handleSelectChange = (itemId: number, newProductId: number) => {
    setSelectedProducts((prev) => ({ ...prev, [itemId]: newProductId }));
  };

  const handleIncrement = (itemId: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: (prev[itemId] || 1) + 1 }));
  };

  const handleDecrement = (itemId: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) - 1),
    }));
  };
  // addon
  const addAddonProduct = (itemId: number) => {
    setAddonProducts((prev) => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), { productId: 0, quantity: 1 }],
    }));
  };

  const updateAddonProduct = (
    itemId: number,
    index: number,
    productId: number
  ) => {
    setAddonProducts((prev) => ({
      ...prev,
      [itemId]: prev[itemId].map((a, i) =>
        i === index ? { ...a, productId } : a
      ),
    }));
  };

  const updateAddonQuantity = (
    itemId: number,
    index: number,
    quantity: number
  ) => {
    setAddonProducts((prev) => ({
      ...prev,
      [itemId]: prev[itemId].map((a, i) =>
        i === index ? { ...a, quantity: Math.max(1, quantity) } : a
      ),
    }));
  };

  // calculate totals  addon
  const getItemTotal = (item: any) => {
    const itemId = item.id;
    const mainPrice = item?.product?.product_price || 0;

    const shopProducts =
      item?.type === "requested"
        ? requestedShopProduct?.data || []
        : offerShopProduct?.data || [];

    const addonsTotal = (addonProducts[itemId] || []).reduce((sum, addon) => {
      const price =
        shopProducts.find((p: any) => +p.id === +addon.productId)
          ?.product_price || 0;

      return sum + price * addon.quantity;
    }, 0);

    const total = (quantities[itemId] || 1) * mainPrice + addonsTotal;

    return {
      total: total.toFixed(2),
      addonsTotal,
    };
  };

  const handleSendCounter = () => {
    if (!data?.data) return;
    const receiverId = data?.data?.sender?.id;

    const offeredItems: any[] = [];
    const requestedItems: any[] = [];

    data?.data?.items?.forEach((item: any) => {
      const addons = addonProducts[item.id] || [];

      if (addons.length > 0) {
        addons.forEach((a) => {
          if (a.productId && a.quantity > 0) {
            const addonItem = {
              product_id: a.productId,
              quantity: a.quantity,
            };

            if (item.type === "offered") offeredItems.push(addonItem);
            if (item.type === "requested") requestedItems.push(addonItem);
          }
        });
      }
    });

    if (offeredItems.length === 0 && requestedItems.length === 0) {
      toast.error("Please add at least one addon product before sending.");
      return;
    }

    const formData = new FormData();
    formData.append("receiver_id", receiverId);
    formData.append("message", message);

    offeredItems.forEach((item, i) => {
      formData.append(
        `offered_items[${i}][product_id]`,
        String(item.product_id)
      );
      formData.append(`offered_items[${i}][quantity]`, String(item.quantity));
    });

    requestedItems.forEach((item, i) => {
      formData.append(
        `requested_items[${i}][product_id]`,
        String(item.product_id)
      );
      formData.append(`requested_items[${i}][quantity]`, String(item.quantity));
    });

    mutate(formData);
  };

  const handleCancleCounter = () => {
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
        toast.error(error?.message);
      },
    });
  };

  const removeAddonProduct = (itemId: number, index: number) => {
    setAddonProducts((prev) => {
      const updated = { ...prev };
      updated[itemId] = prev[itemId].filter((_, i) => i !== index);
      if (updated[itemId].length === 0) delete updated[itemId];
      return updated;
    });
  };

  const actionButtons = ["Go Back", "Cancel", "Send Counter"];
  const actionButtonStyles: Record<
    string,
    { bg?: string; border?: string; text: string }
  > = {
    "Go Back": { border: "border-gray-200", text: "text-black" },
    Cancel: { border: "border-gray-200", text: "text-black" },
    "Send Counter": { bg: "bg-[#E48872]", text: "text-white" },
  };

  return (
    <div className="mb-16">
      <h3 className="text-[#13141D] font-semibold text-[20px] pb-4">
        Counter Offer
      </h3>

      <div>
        {data?.data?.items?.map((product: any, i: number) => {
          console.log("type", product);
          const itemId = product.id;
          const nextItem = data?.data?.items?.[i + 1];
          const showReloadBetween =
            product?.type === "offered" && nextItem?.type === "requested";
          const selectedOfferProductPrice = offerShopProduct?.data?.find(
            (data: any) => data?.id === selectedProducts[itemId]
          );

          const selectedRequestedProductPrice =
            requestedShopProduct?.data?.find(
              (data: any) => data?.id === selectedProducts[itemId]
            );
          const unitPrice = Number(
            selectedOfferProductPrice?.product_price ??
              selectedRequestedProductPrice?.product_price
          );
          const qty = Number(quantities[itemId] || product?.quantity || 1);
          return (
            <div key={itemId}>
              {/* === Product Card === */}
              <div className="py-4 border-t border-b border-[#BFBEBE]">
                <div className="flex flex-col md:flex-row justify-between">
                  {/* Left section */}
                  <div className="flex gap-x-5 2xl:gap-x-10">
                    <Image
                      key={i}
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/${product?.product?.images[0]?.image}`}
                      alt={product?.product?.product_name}
                      height={100}
                      width={100}
                      className="h-[100px] object-cover rounded-md"
                    />

                    <div className="flex flex-col gap-y-1">
                      <h3 className="text-base lg:text-[20px] max-w-[500px] truncate font-semibold text-[#13141D]">
                        {product.product?.product_name}
                      </h3>
                      <h4 className="text-[14px] lg:text-[20px] text-[#4B4A47] flex flex-col 2xl:flex-row gap-x-5 2xl:items-center">
                        {product?.product?.shop?.shop_name}
                        <Link
                          href={`/shop-details?view=${"coustomer"}&id=${
                            product?.product?.shop?.user_id
                          }&listing_id=${product?.product?.shop_info_id}`}
                          className="text-[12px] lg:text-[14px] underline cursor-pointer text-[#A7A39C] font-lato"
                        >
                          View Shop
                        </Link>
                      </h4>
                      {/* <div className="flex gap-x-[2px]">
                        {[
                          ...Array(product?.product?.reviews_avg_rating || 5),
                        ].map((_, i) => (
                          <FaRegStar key={i} className="fill-green-950" />
                        ))}
                        
                      </div> */}
                      <div className="flex gap-1 items-center py-2">
                        {Array.from({
                          length: +product?.product?.reviews_avg_rating,
                        }).map((_, index) => (
                          <FaStar
                            key={index}
                            className="text-primary-green text-sm"
                          />
                        ))}

                        {Array.from({
                          length: 5 - +product?.product?.reviews_avg_rating,
                        }).map((_, index) => (
                          <FaRegStar
                            key={index}
                            className="text-primary-green text-sm"
                          />
                        ))}
                      </div>
                      <div className="flex gap-x-2 items-center">
                        <LocationSvg1 />
                        <h5 className="text-[12px] lg:text-[14px] underline cursor-pointer text-[#A7A39C] font-lato">
                          {product?.type === "offered" &&
                          data?.data?.receiver?.shop_info?.address
                            ?.display_my_address
                            ? data?.data?.receiver?.shop_info?.address
                                ?.address_line_1
                            : ""}

                          {product?.type === "requested" &&
                          data?.data?.sender?.shop_info?.address
                            ?.display_my_address
                            ? data?.data?.sender?.shop_info?.address
                                ?.address_line_1
                            : ""}
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* Right section */}
                  <div className="flex flex-col gap-y-2 mt-2 md:mt-0">
                    <div className="flex items-end gap-2">
                      <div className="flex flex-col gap-2">
                        <h4 className="text-[#4B4A47] font-semibold text-[14px]">
                          Product/Service Trade
                        </h4>
                        <select
                          value={selectedProducts[itemId] || ""}
                          onChange={(e) =>
                            handleSelectChange(itemId, Number(e.target.value))
                          }
                          className="px-4 py-2 rounded-[10px] border border-[#A7A39C] w-full sm:w-[300px] xl:w-[500px]"
                        >
                          {product?.type === "offered" &&
                            requestedShopProduct?.data?.map((p: any) => (
                              <option key={p?.id} value={p?.id}>
                                {p?.product_name?.length > 50
                                  ? `${p.product_name.substring(0, 50)}...`
                                  : p?.product_name}{" "}
                              </option>
                            ))}

                          {product?.type === "requested" &&
                            offerShopProduct?.data?.map((p: any) => (
                              <option key={p?.id} value={p?.id}>
                                {p?.product_name?.length > 50
                                  ? `${p.product_name.substring(0, 50)}...`
                                  : p?.product_name}{" "}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="px-4 py-1 rounded-[10px] border border-[#A7A39C] flex gap-x-3">
                        <button
                          onClick={() => handleDecrement(itemId)}
                          className="font-bold text-[20px]"
                        >
                          -
                        </button>
                        <button className="font-bold text-[20px]">
                          {quantities[itemId] || product?.quantity || 1}
                        </button>
                        <button
                          onClick={() => handleIncrement(itemId)}
                          className="font-bold text-[20px]"
                        >
                          +
                        </button>
                      </div>

                      {/* unit price */}

                      <input
                        className="border border-gray-300 rounded-md p-2 w-full md:w-24 text-center shrink-0"
                        value={`${unitPrice * qty}`}
                        readOnly
                      />
                    </div>

                    {/* Addons */}
                    {(addonProducts[itemId] || []).map((addon, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap gap-2 items-center mt-2 border border-[#E5E5E5] rounded-lg p-2"
                      >
                        <select
                          value={addon.productId}
                          onChange={(e) =>
                            updateAddonProduct(
                              itemId,
                              idx,
                              Number(e.target.value)
                            )
                          }
                          className="px-4 py-2 rounded-[10px] border border-[#A7A39C] w-full sm:w-[300px] xl:w-[400px]"
                        >
                          <option value="">Choose Add-on</option>

                          {product?.product?.shop_info_id ===
                            data?.data?.sender?.shop_info?.id &&
                            requestedShopProduct?.data?.map((p: any) => (
                              <option key={p?.id} value={p?.id}>
                                {p?.product_name?.length > 50
                                  ? `${p.product_name.substring(0, 50)}...`
                                  : p?.product_name}{" "}
                              </option>
                            ))}

                          {product?.product?.shop_info_id ===
                            data?.data?.receiver?.shop_info?.id &&
                            offerShopProduct?.data?.map((p: any) => (
                              <option key={p?.id} value={p?.id}>
                                {p?.product_name?.length > 50
                                  ? `${p.product_name.substring(0, 50)}...`
                                  : p?.product_name}{" "}
                              </option>
                            ))}
                        </select>

                        <div className="px-4 py-1 rounded-[10px] border border-[#A7A39C] justify-center flex gap-x-3 items-center">
                          <button
                            onClick={() =>
                              updateAddonQuantity(
                                itemId,
                                idx,
                                addon.quantity - 1
                              )
                            }
                            className="font-bold text-[20px]"
                          >
                            -
                          </button>
                          <button className="font-bold text-[20px]">
                            {addon.quantity}
                          </button>
                          <button
                            onClick={() =>
                              updateAddonQuantity(
                                itemId,
                                idx,
                                addon.quantity + 1
                              )
                            }
                            className="font-bold text-[20px]"
                          >
                            +
                          </button>
                        </div>
                        <input
                          className="border border-gray-300 rounded-md p-2 w-full md:w-24 text-center shrink-0"
                          value={` ${getItemTotal(product).addonsTotal}`}
                          readOnly
                        />
                        <button
                          onClick={() => removeAddonProduct(itemId, idx)}
                          className="text-red-500 hover:text-red-700 font-semibold text-sm ml-2"
                        >
                          <FaRegTrashAlt />
                        </button>
                      </div>
                    ))}

                    {/* Add addon */}
                    <div
                      className="flex gap-x-2 items-center cursor-pointer hover:opacity-70 transition-opacity mt-2"
                      onClick={() => addAddonProduct(itemId)}
                    >
                      <h6 className="text-[16px] font-semibold text-[#A7A39C]">
                        +
                      </h6>
                      <p className="text-[16px] font-semibold text-[#A7A39C]">
                        Add another product/service
                      </p>
                    </div>

                    {/* Total */}
                    <h5 className="flex gap-x-2 text-[16px] font-semibold text-[#4B4A47] items-center justify-end py-2">
                      Total amount:
                      <span className="text-[20px]">
                        ${getItemTotal(product).total}
                      </span>
                    </h5>
                  </div>
                </div>
              </div>

              {/* === Dynamic Reload Divider === */}
              {showReloadBetween && (
                <div className="flex gap-x-5 items-center my-8">
                  <div className="bg-[#BFBEBE] w-full h-[1px]"></div>
                  <div className="inline-block bg-white">
                    <Reload className="cursor-pointer transform transition-transform hover:rotate-180 duration-500 ease-in-out" />
                  </div>
                  <div className="bg-[#BFBEBE] w-full h-[1px]"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message input */}
      <textarea
        placeholder="Add your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border border-gray-300 rounded-md p-3 mt-6 w-full"
        rows={3}
      />

      {/* Action buttons */}
      <div className="pb-6  rounded-lg mt-6">
        <div className="flex gap-2.5 lg:gap-5 flex-wrap mt-6">
          {actionButtons.map((btn, i) => {
            const style = actionButtonStyles[btn];
            return (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => {
                  if (btn === "Go Back") router.push(`/dashboard/basic/trades`);
                  else if (btn === "Cancel") handleCancleCounter();
                  else if (btn === "Send Counter") handleSendCounter();
                }}
                className={`relative cursor-pointer py-[8px] px-6 rounded-md font-lato font-semibold overflow-hidden
                hover:scale-105 duration-300 ease-in-out text-sm md:text-base
                ${style.bg || ""} ${style.border || "border-2"} ${style.text}
                border-2 disabled:opacity-50`}
              >
                {btn}
              </button>
            );
          })}
        </div>

        {/* <li className="text-[#13141D] font-normal text-[16px] list-disc pt-4">
          Sending a message with a counter offer gives you a better chance of
          getting it accepted.
        </li> */}
      </div>

      {/* <div className="mt-4">
        <CounterBottom />
      </div> */}
    </div>
  );
};

export default CounterTrades;
