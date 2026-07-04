"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/Components/Common/Modal";
import { BsCartPlus } from "react-icons/bs";
import { FaTruck } from "react-icons/fa";
import { GiOpenBook } from "react-icons/gi";
import {
  useWeightRateget,
  useSetShipping,
  useGetFlatRate,
} from "@/Hooks/api/dashboard_api";
import useAuth from "@/Hooks/useAuth";
import Link from "next/link";
import ShippoConfigModal from "./_Components/ShippoConfigModal";
import WeightConfigModal from "./_Components/WeightConfigModal";
import FlatConfigModal from "./_Components/FlatConfigModal";

const Page = () => {
  const { user } = useAuth();
  const [openFlatModal, setOpenFlatModal] = useState(false);
  const [openWightModal, setOpenWightModal] = useState(false);
  const [openConnectModal, setOpenConnectFlatModal] = useState(false);

  /* ---------- API ---------- */
  const { data: weightRanges, refetch } = useWeightRateget();
  const { data: flatRateRanges } = useGetFlatRate();
  const { mutate: setShippo, isPending: isSetting } = useSetShipping();

  const handleShippingMethodChange = (method: string) => {
    if (method === "shippo" && !user?.shop_info?.shippo_connected) {
      toast.error("Please connect Shippo first");
      return;
    }

    if (method === "weight_based" && weightRanges?.data?.length <= 0) {
      toast.error("Weight-based shipping is not configured for this shop");
      return;
    }

    if (method === "flat_rate" && flatRateRanges?.data?.length <= 0) {
      toast.error("Flat-based shipping is not configured for this shop");
      return;
    }

    setShippo(
      { shipping_setting: method },
      {
        onSuccess: (res: any) => {
          if (res?.success) {
            toast.success(res?.message);
          }
        },
      },
    );
  };

  return (
    <>
      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-secondary-black border-b border-[#BFBEBE] pb-2">
        Shipping
      </h2>

      <div className="pt-3 md:pt-6">
        <div className="grid grid-cols-3 gap-8">
          {/* Left */}
          <div className="col-span-2 space-y-4">
            <div>
              <h4 className="text-secondary-black text-[20px] md:text-[24px] font-bold">
                Shipping Settings
              </h4>

              <p className="text-secondary-black text-[13px] md:text-[16px] font-normal mb-3">
                Manage how shipping costs are calculated for your customers at
                checkout. <br /> Choose the option that best fits your products
                and fulfillment process.
              </p>

              <p className="text-secondary-black text-[13px] md:text-[16px] font-normal mb-5">
                Please note: Shipping is only available for shops with an online
                payment provider connected. <br /> To connect a payment
                provider, go to Payments -{" "}
                <Link
                  className="underline text-primary-green"
                  href="/dashboard/pro/payment-method"
                >
                  Payment Integration.
                </Link>
              </p>

              <h5 className="text-secondary-black text-[13px] md:text-[16px] font-semibold">
                Shipping Options
              </h5>

              <p className="text-secondary-black text-[12px] md:text-[16px] font-normal max-w-[570px]">
                The shipping option you select below will determine how shipping
                costs are <br /> calculated during checkout.
              </p>
            </div>

            <div
              onClick={() => handleShippingMethodChange("flat_rate")}
              className={`px-4 py-4 border rounded-lg w-full cursor-pointer transition-all ${isSetting && "animate-pulse"} ${
                user?.shop_info?.shipping_setting === "flat_rate"
                  ? "border-primary-green bg-[#F2EFE8]"
                  : "border-gray-300 hover:border-primary-green"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={user?.shop_info?.shipping_setting === "flat_rate"}
                    readOnly
                    className="h-4 w-4 accent-primary-green cursor-pointer"
                  />

                  <h3 className="font-semibold text-primary-green">
                    Flat Rate
                  </h3>
                </div>

                {user?.shop_info?.shipping_setting === "flat_rate" && (
                  <span className="bg-primary-green text-white px-3 py-1 rounded-full text-sm">
                    Active
                  </span>
                )}
              </div>

              <p className="text-[#3D3D3D] mt-2">
                Charge a fixed shipping amount per order and/or per item.
              </p>

              <button
                onClick={e => {
                  e.stopPropagation();
                  setOpenFlatModal(true);
                }}
                className="mt-3 text-accent-red duration-200 hover:bg-accent-red hover:text-gray-100 transition-all font-semibold cursor-pointer border px-3 py-1 rounded-full text-sm"
              >
                Configure
              </button>
            </div>

            <div
              onClick={() => handleShippingMethodChange("weight_based")}
              className={`px-4 py-4 border rounded-lg w-full cursor-pointer transition-all ${isSetting && "animate-pulse"}
                 ${
                   user?.shop_info?.shipping_setting === "weight_based"
                     ? "border-primary-green bg-[#F2EFE8]"
                     : "border-gray-300 hover:border-primary-green"
                 }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={
                      user?.shop_info?.shipping_setting === "weight_based"
                    }
                    readOnly
                    className="h-4 w-4 accent-primary-green cursor-pointer"
                  />

                  <h3 className="font-semibold text-primary-green">
                    Depending on Weight
                  </h3>
                </div>

                {user?.shop_info?.shipping_setting === "weight_based" && (
                  <span className="bg-primary-green text-white px-3 py-1 rounded-full text-sm">
                    Active
                  </span>
                )}
              </div>

              <p className="text-[#3D3D3D] mt-2">
                Calculate shipping costs based on the total weight of the items
                in the order.
              </p>

              <button
                onClick={e => {
                  e.stopPropagation();
                  setOpenWightModal(true);
                }}
                className="mt-3 text-accent-red duration-200 hover:bg-accent-red hover:text-gray-100 transition-all font-semibold cursor-pointer border px-3 py-1 rounded-full text-sm"
              >
                Configure
              </button>
            </div>

            <div
              onClick={() => handleShippingMethodChange("shippo")}
              className={`px-4 py-4 border rounded-lg w-full cursor-pointer transition-all ${isSetting && "animate-pulse"}
                   ${
                     user?.shop_info?.shipping_setting === "shippo" &&
                     user?.shop_info?.shippo_connected
                       ? "border-primary-green bg-[#F2EFE8]"
                       : "border-gray-300 hover:border-primary-green"
                   }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={
                      user?.shop_info?.shipping_setting === "shippo" &&
                      user?.shop_info?.shippo_connected
                    }
                    readOnly
                    disabled={!user?.shop_info?.shippo_connected}
                    className="h-4 w-4 accent-primary-green cursor-pointer"
                  />

                  <h3 className="font-semibold text-primary-green">Shippo</h3>
                </div>

                <div className="flex gap-2 items-center">
                  {user?.shop_info?.shipping_setting === "shippo" &&
                    user?.shop_info?.shippo_connected && (
                      <span className="bg-primary-green text-white px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    )}
                </div>
              </div>

              <p className="text-[#3D3D3D] mt-2">
                Connect your Shippo account to automatically calculate rates and
                generate shipping labels.
              </p>

              <button
                onClick={e => {
                  e.stopPropagation();
                  setOpenConnectFlatModal(true);
                }}
                className="mt-3 text-accent-red duration-200 hover:bg-accent-red hover:text-gray-100 transition-all font-semibold cursor-pointer border px-3 py-1 rounded-full text-sm"
              >
                Configure
              </button>
            </div>

            <div className="border border-off-green/40 bg-off-green/20 rounded-lg p-5">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center">
                  i
                </div>

                <p className="text-[#374151] leading-7">
                  <span className="font-semibold">Important:</span> Only one
                  shipping calculator can be active at a time. <br />
                  The active option determines how shipping charges are
                  calculated for customers during checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Card 1 */}
            <div className="border rounded-xl p-5 border-off-green/40 bg-off-green/20 text-[15px]">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-off-green/50 text-primary-green flex items-center justify-center shrink-0 text-2xl">
                  <BsCartPlus />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    How it works at checkout
                  </h3>

                  <p className="mt-1.5 text-gray-800 leading-7">
                    The shipping option you choose will be used to calculate
                    shipping costs during checkout.
                  </p>

                  <p className="mt-2 text-gray-800 leading-7">
                    Customers will see the final shipping cost before they
                    complete their order.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border rounded-xl p-5 border-off-green/40 bg-off-green/20  text-[15px]">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full shrink-0 bg-off-green/50 text-primary-green flex items-center justify-center text-2xl">
                  <FaTruck />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    Offering local delivery?
                  </h3>

                  <p className="mt-1.5 text-gray-800 leading-7">
                    Sustainable Trades does not currently include a dedicated
                    local delivery fulfillment option.
                  </p>

                  <p className="mt-2 text-gray-800 leading-7">
                    However, it is at the top of our development roadmap.
                  </p>

                  <p className="mt-2 text-gray-800 leading-7">
                    For some viable workarounds, check out our how-to videos.
                  </p>

                  <Link
                    href="/help"
                    className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-primary-green"
                  >
                    Go to How-To Videos →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border rounded-xl p-5 border-off-green/40 bg-off-green/20 text-[15px]">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-off-green/50 text-primary-green flex items-center justify-center shrink-0 text-2xl">
                  <GiOpenBook />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Need help?</h3>

                  <p className="mt-1.5 text-gray-800 leading-7">
                    Check out our how-to videos in the Help Center for
                    step-by-step guidance.
                  </p>

                  <Link
                    href="/help"
                    className="inline-flex items-center gap-2 text-sm mt-4 font-bold text-primary-green"
                  >
                    Go to How-To Videos →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FLAT RATE MODAL ================= */}
      <Modal open={openFlatModal} onClose={() => setOpenFlatModal(false)}>
        <FlatConfigModal
          flatRateRanges={flatRateRanges}
          setOpenFlatModal={setOpenFlatModal}
        />
      </Modal>

      {/* ================= WEIGHT MODAL ================= */}
      <Modal open={openWightModal} onClose={() => setOpenWightModal(false)}>
        <WeightConfigModal
          weightRanges={weightRanges}
          refetch={refetch}
          setOpenWightModal={setOpenWightModal}
        />
      </Modal>

      {/* ================= SHIPSTATION MODAL ================= */}
      <Modal
        open={openConnectModal}
        onClose={() => setOpenConnectFlatModal(false)}
        className="max-w-3xl"
      >
        <ShippoConfigModal
          user={user}
          setOpenConnectFlatModal={setOpenConnectFlatModal}
        />
      </Modal>
    </>
  );
};

export default Page;
