"use client";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "@/Components/Common/Modal";
import { MdOutlineLocationOn } from "react-icons/md";
import { RiLightbulbFlashLine } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";
import {
  useFlatRate,
  useWeightRate,
  useWeightRateget,
  useWeightRateDelete,
  useConnectShippo,
  useDisconnectShippo,
  useSyncShippo,
  useChangeLabelType,
  usePickCarrier,
  useSetShipping,
  useGetFlatRate,
} from "@/Hooks/api/dashboard_api";
import useAuth from "@/Hooks/useAuth";
import Link from "next/link";

interface FlatRateForm {
  option_name: string;
  per_order_fee: string;
  per_item_fee: string;
}

interface WeightForm {
  cost: string;
  min_weight: string;
  max_weight: string;
}

const Page = () => {
  const { user } = useAuth();
  const [openFlatModal, setOpenFlatModal] = useState(false);
  const [openWightModal, setOpenWightModal] = useState(false);
  const [openConnectModal, setOpenConnectFlatModal] = useState(false);

  /* ---------- API ---------- */
  const { data: weightRanges, refetch } = useWeightRateget();
  const { data: flatRateRanges } = useGetFlatRate();
  const { mutate: deleteWeightRange } = useWeightRateDelete();
  const { mutate: FlatRateMutation, isPending } = useFlatRate();
  const { mutate: syncShippo, isPending: isSyncing } = useSyncShippo();
  const { mutate: setShippo, isPending: isSetting } = useSetShipping();
  const { mutate: connectShippo, isPending: isConnecting } = useConnectShippo();
  const { mutate: useWeightMutation, isPending: isWightLoading } =
    useWeightRate();
  const { mutate: disconnectShippo, isPending: isDisconnecting } =
    useDisconnectShippo();
  const { mutate: pickupCarrier, isPending: isPickingCarrier } =
    usePickCarrier();
  const { mutate: changeLabelType, isPending: isChangingLabelType } =
    useChangeLabelType();

  /* ---------- FORMS ---------- */
  const {
    register: registerFlat,
    handleSubmit: handleFlatSubmit,
    reset: resetFlat,
    formState: { errors: flatErrors },
  } = useForm<FlatRateForm>();

  const {
    register: registerWeight,
    handleSubmit: handleWeightSubmit,
    reset: resetWeight,
    formState: { errors: weightErrors },
  } = useForm<WeightForm>();

  /* ---------- SUBMIT HANDLERS ---------- */
  const onFlatSubmit = (data: FlatRateForm) => {
    FlatRateMutation(data, {
      onSuccess: (data: any) => {
        if (data?.success) {
          toast.success(data?.message);
          resetFlat();
          setOpenFlatModal(false);
        }
      },
    });
  };

  const onWeightSubmit = (data: WeightForm) => {
    useWeightMutation(data, {
      onSuccess: (data: any) => {
        if (data?.success) {
          toast.success(data?.message);
          resetWeight();
          refetch();
        }
      },
    });
  };

  const handleDeleteRange = (id: number) => {
    deleteWeightRange(
      { endpoint: `/api/weight_range/${id}` },
      { onSuccess: refetch },
    );
  };

  const handleCarrierToggle = (carrierAccount: any) => {
    if (!carrierAccount?.shippo_object_id) return;

    pickupCarrier({
      endpoint: `/api/shippo/carrier/${carrierAccount.id}`,
      active: !carrierAccount.active,
    });
  };

  const handleLabelTypeChange = (rate: any) => {
    changeLabelType({
      endpoint: `/api/shippo/rate-preference/${rate.id}`,
      active: !rate.active,
    });
  };

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
      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-[#000] border-b border-[#BFBEBE] pb-2">
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

              <p className="text-secondary-black text-[13px] md:text-[16px] font-normal mb-5">
                Manage how shipping costs are calculated for your customers at
                checkout. <br /> Choose the option that best fits your products
                and fulfillment process.
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

                  <h3 className="font-bold text-primary-green">Flat Rate</h3>
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

                  <h3 className="font-bold text-primary-green">
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
                     user?.shop_info?.shipping_setting === "shippo"
                       ? "border-primary-green bg-[#F2EFE8]"
                       : "border-gray-300 hover:border-primary-green"
                   }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={user?.shop_info?.shipping_setting === "shippo"}
                    readOnly
                    disabled={!user?.shop_info?.shippo_connected}
                    className="h-4 w-4 accent-primary-green cursor-pointer"
                  />

                  <h3 className="font-bold text-primary-green">Shippo</h3>
                </div>

                <div className="flex gap-2 items-center">
                  {user?.shop_info?.shipping_setting === "shippo" && (
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

            <div className="border border-[#d4e2cb]/40 bg-[#d4e2cb]/20 rounded-lg p-5">
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
            <div className="border rounded-xl p-5 border-[#d4e2cb]/40 bg-[#d4e2cb]/20 text-[15px]">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-[#d4e2cb]/50 flex items-center justify-center shrink-0 text-2xl">
                  🛒
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
            <div className="border rounded-xl p-5 border-[#f4d09b91]  bg-[#f4d09b17] text-[15px]">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full shrink-0 bg-[#FFF1D8] flex items-center justify-center text-2xl">
                  🚚
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
            <div className="border rounded-xl p-5 border-gray-300 bg-[#FAFAF8] text-[15px]">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-[#EEF3EA] flex items-center justify-center shrink-0 text-2xl">
                  📖
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
        <h3 className="text-[#3D3D3D] text-[18px] md:text-[24px] font-bold text-center">
          ADD FLAT RATE
        </h3>

        <form
          onSubmit={handleFlatSubmit(onFlatSubmit)}
          className="mt-2.5 md:mt-5 flex flex-col gap-y-5"
        >
          <h5 className="text-[#3D3D3D] font-semibold text-[16px] text-center pb-4 border-b border-[#3D3D3D]">
            Formula
          </h5>

          <div>
            <p className="form-label font-bold">Option Name *</p>
            <input
              className="form-input"
              defaultValue={flatRateRanges?.data?.option_name}
              placeholder="“FedEx Next Day”, “USPS Express Mail”"
              {...registerFlat("option_name", { required: true })}
            />

            {flatErrors.option_name && (
              <p className="text-red-500 text-sm mt-1">
                This field is required
              </p>
            )}
          </div>

          <div className="flex gap-x-10">
            <div className="w-full">
              <p className="form-label font-bold">Per Order Fee </p>
              <input
                type="number"
                className="form-input"
                defaultValue={flatRateRanges?.data?.per_order_fee}
                placeholder="$ XXX"
                {...registerFlat("per_order_fee", { required: true })}
              />

              {flatErrors.per_order_fee && (
                <p className="text-red-500 text-sm mt-1">
                  This field is required
                </p>
              )}
            </div>

            <div className="w-full">
              <p className="form-label font-bold">Fee per item </p>
              <input
                type="number"
                className="form-input"
                defaultValue={flatRateRanges?.data?.per_item_fee}
                placeholder="$ XXX"
                {...registerFlat("per_item_fee", { required: true })}
              />

              {flatErrors.per_item_fee && (
                <p className="text-red-500 text-sm mt-1">
                  This field is required
                </p>
              )}
            </div>
          </div>

          <div className="border border-[#d4e2cb]/40 bg-[#d4e2cb]/40 rounded-lg font-semibold p-4">
            <p className="text-primary-green text-sm flex gap-2 items-center">
              <MdOutlineLocationOn className="text-xl" />
              This flat rate option is for U.S. and Canada only.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || isSetting}
              className="px-4 py-2 md:py-4 text-white font-semibold bg-primary-green rounded w-[190px] cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed"
            >
              {isPending || isSetting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= WEIGHT MODAL ================= */}
      <Modal open={openWightModal} onClose={() => setOpenWightModal(false)}>
        <h3 className="text-[#3D3D3D] text-[24px] font-bold text-center pb-4 border-b border-[#3D3D3D]">
          ADD WEIGHT RANGE RATE
        </h3>

        <form
          onSubmit={handleWeightSubmit(onWeightSubmit)}
          className="mt-2.5 md:mt-5 flex flex-col gap-y-5"
        >
          <div>
            <p className="form-label font-bold">Cost *</p>
            <input
              type="number"
              className="form-input"
              placeholder="Cost"
              {...registerWeight("cost", { required: true })}
            />

            {weightErrors.cost && (
              <p className="text-red-500 text-sm mt-1">
                This field is required
              </p>
            )}
          </div>

          <div className="flex gap-x-10">
            <div className="w-full">
              <p className="form-label font-bold">Min Weight</p>
              <input
                type="number"
                className="form-input"
                placeholder="kg"
                {...registerWeight("min_weight", { required: true })}
              />

              {weightErrors.min_weight && (
                <p className="text-red-500 text-sm mt-1">
                  This field is required
                </p>
              )}
            </div>

            <div className="w-full">
              <p className="form-label font-bold">Max Weight</p>
              <input
                type="number"
                className="form-input"
                placeholder="kg"
                {...registerWeight("max_weight", { required: true })}
              />

              {weightErrors.max_weight && (
                <p className="text-red-500 text-sm mt-1">
                  This field is required
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isWightLoading || isSetting}
              className="mt-8 px-4 py-2 md:py-4 text-white font-semibold bg-primary-green rounded w-47.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isWightLoading || isSetting ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="border border-[#d4e2cb]/30 bg-[#d4e2cb]/30 rounded-lg p-4">
            <div className="text-primary-green text-sm flex gap-5 items-center">
              <span className="shrink-0 bg-[#d4e2cb]/60 size-14 rounded-full grid place-items-center">
                <RiLightbulbFlashLine className="text-2xl" />
              </span>

              <div>
                <h3 className="text-base font-semibold">How it works</h3>
                <p className="text-gray-700 mt-1">
                  Set a cost for a specific weight range by adding a minimum and
                  maximum weight. You can create as many ranges as you need to
                  match your shipping strategy.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-[#d4e2cb]/30 bg-[#d4e2cb]/30 rounded-lg font-semibold -mt-2 p-4">
            <p className="text-gray-700 text-sm flex gap-2 items-center">
              <IoLocationSharp className="text-xl text-primary-green" />
              This weight-based rate option is for U.S. and Canada only.
            </p>
          </div>
        </form>

        <h4 className="text-[20px] font-semibold text-primary-green mt-5">
          Weight Ranges
        </h4>
        <p className="font-normal text-[16px] text-[#3D3D3D]">
          Depending on the total weight, you can charge different amounts for
          shipping.
        </p>

        <table className="w-full border-collapse my-5 px-5">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-[18px] font-medium">
                Weight (lbs)
              </th>
              <th className="text-left py-2 text-[18px] font-medium">Cost</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {weightRanges?.data?.length ? (
              weightRanges.data.map((range: any) => (
                <tr key={range.id} className="group hover:bg-[#C2D5D0]">
                  <td className="p-2 text-sm">
                    {range.min_weight} to {range.max_weight}
                  </td>
                  <td className="py-2 text-sm">${range.cost}</td>
                  <td className="px-5 text-right">
                    <button
                      onClick={() => handleDeleteRange(range.id)}
                      className="text-red-600 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-2 text-center text-gray-500">
                  No weight ranges available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>

      {/* ================= SHIPSTATION MODAL ================= */}
      <Modal
        open={openConnectModal}
        onClose={() => setOpenConnectFlatModal(false)}
      >
        <h3 className="text-[#3D3D3D] text-[18px] md:text-[24px] font-bold text-center">
          {user?.shop_info?.shippo_connected
            ? "DISCONNECT FROM SHIPPO"
            : "CONNECT TO SHIPPO"}
        </h3>

        <div className="px-6 py-6 space-y-5">
          <p className="font-semibold text-secondary-black">
            Flexible, powerful shipping starting at $0/month (billed directly by
            Shippo)
          </p>

          <ul className="list-disc list-inside space-y-1 text-secondary-black text-[15px]">
            <li>
              Sync your Sustainable Trades orders with Shippo in just a few
              clicks.
            </li>
            <li>
              Access deeply discounted shipping rates across major carriers.
            </li>
            <li>Manage and fulfill orders directly from the Shippo Web App.</li>
            <li>
              Automate label creation, returns, tracking updates, and more.
            </li>
          </ul>

          <p className="text-sm text-secondary-black leading-relaxed">
            Shippo is a leading web-based shipping platform designed for small
            and growing online sellers. By creating a Shippo account,
            Sustainable Trades members can import their orders, print shipping
            labels, and streamline fulfillment—all while keeping their data in
            sync with their Sustainable Trades shop.
          </p>

          <p>
            <span className="font-semibold text-secondary-black">
              Sustainable Trades customers are billed directly by Shippo.
            </span>
            <br />
            To learn more,{" "}
            <Link
              target="_blank"
              href="https://support.goshippo.com/hc/en-us/articles/360003855652-Shippo-Subscription-Plan-Overview#h_bbb2a330-d818-489d-b316-26700ac76825"
              className="text-blue-500 underline"
            >
              view Shippo’s pricing plans here
            </Link>
            .
          </p>

          {!user?.shop_info?.shippo_connected && (
            <p className="text-primary-green">
              <span className="font-semibold"> Note:</span> Connecting to Shippo
              will allow you to pick from multiple carriers and label types.
            </p>
          )}

          {user?.shop_info?.shippo_connected && (
            <div className="space-y-5 border-t pt-5 border-gray-700">
              {/* Carrier */}
              <div>
                <label className="block text-sm font-semibold text-secondary-black mb-3">
                  Pick your carrier
                </label>

                <div className="space-y-3">
                  {user?.shop_info?.shippo_carrier_accounts?.map(
                    (carrierAccount: any) => {
                      const isAvailable = !!carrierAccount.shippo_object_id;

                      return (
                        <div
                          key={carrierAccount.id}
                          className={`flex items-center justify-between border rounded-lg p-3 ${
                            !isAvailable ? "opacity-50" : ""
                          }`}
                        >
                          <div>
                            <p className="font-medium">
                              {carrierAccount.carrier_name}
                            </p>

                            {!isAvailable && (
                              <p className="text-xs text-red-500">
                                Not connected in Shippo
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={!isAvailable || isPickingCarrier}
                            onClick={() => handleCarrierToggle(carrierAccount)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              carrierAccount.active
                                ? "bg-primary-green"
                                : "bg-gray-300"
                            } ${
                              !isAvailable
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                carrierAccount.active
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Label Type */}
              <div>
                <label className="block text-sm font-semibold text-secondary-black mb-3">
                  Choose label type
                </label>

                <div className="space-y-2">
                  {user?.shop_info?.shippo_rate_preferences?.map(
                    (rate: any) => (
                      <label
                        key={rate.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          disabled={isChangingLabelType}
                          name="labelType"
                          checked={rate.active}
                          onChange={() => handleLabelTypeChange(rate)}
                          className="h-4 w-4 accent-primary-green cursor-pointer"
                        />

                        <span className="capitalize">{rate.rate_type}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end px-6 py-4">
          {user?.shop_info?.shippo_connected ? (
            <div className="flex gap-3 items-center">
              <button
                disabled={isDisconnecting}
                onClick={() =>
                  disconnectShippo(undefined, {
                    onSuccess: (res: any) => {
                      if (res?.success) {
                        setOpenConnectFlatModal(false);
                      }
                    },
                  })
                }
                className="bg-primary-red text-white px-6 py-2 rounded-md font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
              >
                Disconnect from Shippo
              </button>

              <button
                disabled={isSyncing}
                onClick={() => syncShippo()}
                className="bg-[#0B3C32] text-white px-6 py-2 rounded-md font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
              >
                Sync now
              </button>
            </div>
          ) : (
            <button
              disabled={isConnecting || isSetting}
              onClick={() => connectShippo()}
              className="bg-[#0B3C32] text-white px-6 py-2 rounded-md font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
            >
              Connect to Shippo
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Page;
