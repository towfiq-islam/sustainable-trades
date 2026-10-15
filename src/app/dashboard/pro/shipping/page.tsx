"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/Components/Common/Modal";
import { BsCartPlus } from "react-icons/bs";
import { FaTruck } from "react-icons/fa";
import { GiOpenBook } from "react-icons/gi";
import useAuth from "@/Hooks/useAuth";
import Link from "next/link";
import ShippoConfigModal from "./_Components/ShippoConfigModal";
import WeightConfigModal from "./_Components/WeightConfigModal";
import FlatConfigModal from "./_Components/FlatConfigModal";
import {
  useGetFlatRateQuery,
  useGetWeightRatesQuery,
  useSetShippingMutation,
} from "@/redux/api/vendorApi";

const Page = () => {
  const { user } = useAuth();
  const [openFlatModal, setOpenFlatModal] = useState(false);
  const [openWightModal, setOpenWightModal] = useState(false);
  const [openConnectModal, setOpenConnectFlatModal] = useState(false);

  /* ---------- API ---------- */
  const { data: weightRanges } = useGetWeightRatesQuery();
  const { data: flatRateRanges } = useGetFlatRateQuery();
  const [setShippo, { isLoading: isSetting }] = useSetShippingMutation();

  const handleShippingMethodChange = (method: string) => {
    if (method === "shippo" && !user?.shop_info?.shippo_connected) {
      toast.error("Shippo is not connected for this shop");
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

    setShippo({ shipping_setting: method })
      .unwrap()
      .then(res => {
        toast.success(res.message);
      })
      .catch(err => {
        toast.error(err?.data?.message);
      });
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-5 md:gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h4 className="text-secondary-black text-[20px] md:text-[24px] font-semibold mb-2">
              Shipping Settings
            </h4>

            <p className="text-secondary-black text-sm md:text-[16px] font-normal mb-3">
              Manage how shipping costs are calculated for your customers at
              checkout. <br /> Choose the option that best fits your products
              and fulfillment process.
            </p>

            <p className="text-secondary-black text-sm md:text-[16px] font-normal mb-5">
              Please note: Shipping is only available for shops with an online
              payment provider connected. <br /> To connect a payment provider,
              go to Payments -{" "}
              <Link
                className="underline text-primary-green"
                href="/dashboard/pro/payment-method"
              >
                Payment Integration.
              </Link>
            </p>

            <h5 className="text-secondary-black text-sm md:text-[16px] font-semibold">
              Shipping Options
            </h5>

            <p className="text-secondary-black text-sm md:text-[16px] font-normal max-w-[570px]">
              The shipping option you select below will determine how shipping
              costs are <br /> calculated during checkout.
            </p>
          </div>

          <div
            onClick={() => handleShippingMethodChange("flat_rate")}
            className={`p-3 md:p-4 border rounded-lg w-full cursor-pointer transition-all ${isSetting && "animate-pulse"} ${
              user?.shop_info?.shipping_setting === "flat_rate"
                ? "border-primary-green bg-warm-card"
                : "border-gray-300 hover:border-primary-green"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 md:gap-3">
                <input
                  type="radio"
                  checked={user?.shop_info?.shipping_setting === "flat_rate"}
                  readOnly
                  className="h-4 w-4 accent-primary-green cursor-pointer"
                />

                <h3 className="text-sm md:text-base font-semibold text-primary-green">
                  Flat Rate
                </h3>
              </div>

              {user?.shop_info?.shipping_setting === "flat_rate" && (
                <span className="bg-primary-green text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                  Active
                </span>
              )}
            </div>

            <p className="text-dark-gray text-sm md:text-base mt-2">
              Charge a fixed shipping amount per order and/or per item.
            </p>

            <button
              onClick={e => {
                e.stopPropagation();
                setOpenFlatModal(true);
              }}
              className="mt-3 text-accent-red duration-200 hover:bg-accent-red hover:text-gray-100 transition-all font-semibold cursor-pointer border px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
            >
              Configure
            </button>
          </div>

          <div
            onClick={() => handleShippingMethodChange("weight_based")}
            className={`p-3 md:p-4 border rounded-lg w-full cursor-pointer transition-all ${isSetting && "animate-pulse"}
                 ${
                   user?.shop_info?.shipping_setting === "weight_based"
                     ? "border-primary-green bg-warm-card"
                     : "border-gray-300 hover:border-primary-green"
                 }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 md:gap-3">
                <input
                  type="radio"
                  checked={user?.shop_info?.shipping_setting === "weight_based"}
                  readOnly
                  className="h-4 w-4 accent-primary-green cursor-pointer"
                />

                <h3 className="text-sm md:text-base font-semibold text-primary-green">
                  Depending on Weight
                </h3>
              </div>

              {user?.shop_info?.shipping_setting === "weight_based" && (
                <span className="bg-primary-green text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                  Active
                </span>
              )}
            </div>

            <p className="text-dark-gray text-sm md:text-base mt-2">
              Calculate shipping costs based on the total weight of the items in
              the order.
            </p>

            <button
              onClick={e => {
                e.stopPropagation();
                setOpenWightModal(true);
              }}
              className="mt-3 text-accent-red duration-200 hover:bg-accent-red hover:text-gray-100 transition-all font-semibold cursor-pointer border px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
            >
              Configure
            </button>
          </div>

          <div
            onClick={() => handleShippingMethodChange("shippo")}
            className={`p-3 md:p-4 border rounded-lg w-full cursor-pointer transition-all ${isSetting && "animate-pulse"}
                   ${
                     user?.shop_info?.shipping_setting === "shippo" &&
                     user?.shop_info?.shippo_connected
                       ? "border-primary-green bg-warm-card"
                       : "border-gray-300 hover:border-primary-green"
                   }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 md:gap-3">
                <input
                  type="radio"
                  checked={
                    user?.shop_info?.shipping_setting === "shippo" &&
                    user?.shop_info?.shippo_connected
                  }
                  readOnly
                  className="h-4 w-4 accent-primary-green cursor-pointer"
                />

                <h3 className="text-sm md:text-base font-semibold text-primary-green">
                  Shippo
                </h3>
              </div>

              <div className="flex gap-2 items-center">
                {user?.shop_info?.shipping_setting === "shippo" &&
                  user?.shop_info?.shippo_connected && (
                    <span className="bg-primary-green text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                      Active
                    </span>
                  )}
              </div>
            </div>

            <p className="text-dark-gray text-sm md:text-base mt-2">
              Connect your Shippo account to automatically calculate rates and
              generate shipping labels.
            </p>

            <button
              onClick={e => {
                e.stopPropagation();
                setOpenConnectFlatModal(true);
              }}
              className="mt-3 text-accent-red duration-200 hover:bg-accent-red hover:text-gray-100 transition-all font-semibold cursor-pointer border px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
            >
              {user?.shop_info?.shippo_connected ? "Configure" : "Connect"}
            </button>
          </div>

          <div className="border border-off-green/40 bg-off-green/20 rounded-lg p-3 md:p-5">
            <div className="flex gap-3">
              <div className="size-6 md:size-8 rounded-full bg-primary-green text-white flex items-center justify-center shrink-0">
                i
              </div>

              <p className="text-secondary-gray leading-6 md:leading-7 text-sm md:text-base">
                <span className="font-semibold">Important:</span> Only one
                shipping calculator can be active at a time. <br />
                The active option determines how shipping charges are calculated
                for customers during checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-3 lg:space-y-6">
          {/* Card 1 */}
          <div className="border rounded-xl p-3 2xl:p-5 border-off-green/40 bg-off-green/20 text-[15px]">
            <div className="flex gap-4">
              <div className="size-10 md:size-12 2xl:size-16 rounded-full bg-off-green/50 text-primary-green flex items-center justify-center shrink-0 md:text-xl 2xl:text-2xl">
                <BsCartPlus />
              </div>

              <div>
                <h3 className="font-semibold text-sm md:text-base 2xl:text-lg">
                  How it works at checkout
                </h3>

                <p className="mt-1.5 text-gray-800 leading-6 md:leading-7 text-sm md:text-base">
                  The shipping option you choose will be used to calculate
                  shipping costs during checkout.
                </p>

                <p className="mt-2 text-gray-800 leading-6 md:leading-7 text-sm md:text-base">
                  Customers will see the final shipping cost before they
                  complete their order.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border rounded-xl p-3 2xl:p-5 border-off-green/40 bg-off-green/20  text-[15px]">
            <div className="flex gap-4">
              <div className="size-10 md:size-12 2xl:size-16 rounded-full bg-off-green/50 text-primary-green flex items-center justify-center shrink-0 md:text-xl 2xl:text-2xl">
                <FaTruck />
              </div>

              <div>
                <h3 className="font-semibold text-sm md:text-base 2xl:text-lg">
                  Offering local delivery?
                </h3>

                <p className="mt-1.5 text-gray-800 leading-6 md:leading-7 text-sm md:text-base">
                  Sustainable Trades does not currently include a dedicated
                  local delivery fulfillment option.
                </p>

                <p className="mt-2 text-gray-800 leading-6 md:leading-7 text-sm md:text-base">
                  However, it is at the top of our development roadmap.
                </p>

                <p className="mt-2 text-gray-800 leading-6 md:leading-7 text-sm md:text-base">
                  For some viable workarounds, check out our how-to videos.
                </p>

                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold 2xl:font-bold text-primary-green"
                >
                  Go to How-To Videos →
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border rounded-xl p-3 md:p-5 border-off-green/40 bg-off-green/20 text-[15px]">
            <div className="flex gap-4">
              <div className="size-10 md:size-12 2xl:size-16 rounded-full bg-off-green/50 text-primary-green flex items-center justify-center shrink-0 md:text-xl 2xl:text-2xl">
                <GiOpenBook />
              </  div>

              <div>
                <h3 className="font-semibold text-sm md:text-base 2xl:text-lg">
                  Need help?
                </h3>

                <p className="mt-1.5 text-gray-800 leading-6 md:leading-7 text-sm md:text-base">
                  Check out our how-to videos in the Help Center for
                  step-by-step guidance.
                </p>

                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 text-xs md:text-sm mt-4 font-bold text-primary-green"
                >
                  Go to How-To Videos →
                </Link>
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
