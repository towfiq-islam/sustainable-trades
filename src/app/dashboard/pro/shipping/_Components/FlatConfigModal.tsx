import { MdOutlineLocationOn } from "react-icons/md";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useFlatRate } from "@/Hooks/api/dashboard_api";

interface FlatRateForm {
  option_name: string;
  per_order_fee: string;
  per_item_fee: string;
}

const FlatConfigModal = ({ flatRateRanges, setOpenFlatModal }: any) => {
  const { mutate: FlatRateMutation, isPending } = useFlatRate();

  const {
    register: registerFlat,
    handleSubmit: handleFlatSubmit,
    reset: resetFlat,
    formState: { errors: flatErrors },
  } = useForm<FlatRateForm>();

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

  return (
    <div>
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
            <p className="text-red-500 text-sm mt-1">This field is required</p>
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

        <div className="border border-off-green/40 bg-off-green/40 rounded-lg font-semibold p-4">
          <p className="text-primary-green text-sm flex gap-2 items-center">
            <MdOutlineLocationOn className="text-xl" />
            This flat rate option is for U.S. and Canada only.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 md:py-4 text-white font-semibold bg-primary-green rounded w-[190px] cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlatConfigModal;
