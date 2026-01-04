"use client";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "@/Components/Common/Modal";
import {
  useFlatRate,
  useWeightRate,
  useWeightRateget,
  useWeightRateDelete,
} from "@/Hooks/api/dashboard_api";

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
  const [openFlatModal, setOpenFlatModal] = useState(false);
  const [openWightModal, setOpenWightModal] = useState(false);
  const [openConnectModal, setOpenConnectFlatModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* ---------- API ---------- */
  const { data: weightRanges, refetch } = useWeightRateget();
  const { mutate: deleteWeightRange } = useWeightRateDelete();
  const { mutate: FlatRateMutation, isPending } = useFlatRate();
  const { mutate: useWeightMutation, isPending: isWightLoading } =
    useWeightRate();

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
      { onSuccess: refetch }
    );
  };

  return (
    <>
      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-[#000] border-b border-[#BFBEBE] pb-2">
        Shipping
      </h2>

      <div className="pt-3 md:pt-6">
        <h4 className="text-[#13141D] text-[20px] md:text-[24px] font-bold">
          Shipping Settings
        </h4>
        <p className="text-[#13141D] text-[13px] md:text-[16px] font-normal">
          You can manage available shipping options for customers and set up
          your preferred shipping calculator.
        </p>

        <div className="pt-3 md:pt-6 flex flex-col gap-y-2 md:gap-y-4">
          <h5 className="text-[#13141D] text-[13px] md:text-[16px] font-semibold">
            Shipping Options
          </h5>
          <p className="text-[#13141D] text-[12px] md:text-[16px] font-normal max-w-[570px]">
            You can choose how you want to apply shipping costs to your order.
            Shipping cost can be calculated with a flat rate, by weight, or
            connect your store to ShipStation and enjoy full shipping
            integration including automated shipping labels!
          </p>

          <div className="relative w-full">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#274F45] text-white px-4 py-2 rounded-lg w-fit font-semibold flex gap-x-5 items-center text-[14px] md:text-[16px] cursor-pointer"
            >
              <FaAngleDown />
              Add Shipping Option
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-5 w-full flex flex-col gap-y-4">
                <button
                  onClick={() => setOpenFlatModal(true)}
                  className="px-2 md:px-4 py-3 bg-[#F2EFE8] border border-[#3C665B] p-4 rounded-lg w-full max-w-[700px] text-left cursor-pointer"
                >
                  <h3 className="text-[#274F45] font-bold text-[14px] md:text-[16px]">
                    Flat Rate
                  </h3>
                  <p className="text-[13px] md:text-[16px] text-[#3D3D3D] font-medium pt-1">
                    Define a charge for every order and a flat fee for each
                    item.
                  </p>
                </button>

                <button
                  onClick={() => setOpenWightModal(true)}
                  className="px-2 md:px-4 py-3 bg-[#F2EFE8] border border-[#3C665B] p-4 rounded-lg w-full max-w-[700px] text-left cursor-pointer"
                >
                  <h3 className="text-[#274F45] font-bold text-[14px] md:text-[16px]">
                    Depending on Weight
                  </h3>
                  <p className="text-[13px] md:text-[16px] text-[#3D3D3D] font-medium pt-1">
                    Define a charge for every order and a flat fee for each
                    item.
                  </p>
                </button>

                <button
                  onClick={() => setOpenConnectFlatModal(true)}
                  className="px-2 md:px-4 py-3 bg-[#F2EFE8] border border-[#3C665B] p-4 rounded-lg w-full max-w-[700px] text-left cursor-pointer"
                >
                  <h3 className="text-[#274F45] font-bold text-[16px]">
                    Connect ShipStation
                  </h3>
                  <p className="text-[16px] text-[#3D3D3D] font-medium pt-1">
                    Define a charge for every order and a flat fee for each
                    item.
                  </p>
                </button>
              </div>
            )}
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="mt-8 px-4 py-2 md:py-4 text-white font-semibold bg-[#274F45] rounded w-[190px] cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Save"}
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
              disabled={isWightLoading}
              className="mt-8 px-4 py-2 md:py-4 text-white font-semibold bg-[#274F45] rounded w-[190px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isWightLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

        <h4 className="text-[20px] font-semibold text-[#274F45] mt-5">
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
          CONNECT TO SHIPSTATION
        </h3>

        <div className="px-6 py-6 space-y-5">
          <p className="font-semibold text-[#13141D]">
            Only $9.00 per month (paid directly to ShipStation)
          </p>

          <ul className="list-disc list-inside space-y-1 text-[#13141D] text-[15px]">
            <li>
              Easily import and manage orders from all your sales channels.
            </li>
            <li>
              Access the lowest shipping rates, no matter how much you ship.
            </li>
            <li>
              Streamline your processes with powerful automation tools to save
              time and boost efficiency.
            </li>
          </ul>

          <p className="text-sm text-[#13141D] leading-relaxed">
            ShipStation is the world’s leading web-based shipping solution for
            ecommerce retailers.
          </p>
        </div>

        <div className="flex justify-end px-6 py-4 border-t">
          <button className="bg-[#0B3C32] text-white px-6 py-2 rounded-md font-medium">
            Connect to ShipStation
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Page;
