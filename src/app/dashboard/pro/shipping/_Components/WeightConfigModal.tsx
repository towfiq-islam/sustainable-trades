import { useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { RiLightbulbFlashLine } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import {
  useCreateWeightRateMutation,
  useDeleteWeightRateMutation,
} from "@/redux/api/dashboardApi";

interface WeightForm {
  cost: string;
  min_weight: string;
  max_weight: string;
}

const WeightConfigModal = ({ weightRanges }: any) => {
  const {
    register: registerWeight,
    handleSubmit: handleWeightSubmit,
    reset: resetWeight,
    formState: { errors: weightErrors },
  } = useForm<WeightForm>();

  const [useWeightMutation, { isLoading: isWightLoading }] =
    useCreateWeightRateMutation();
  const [deleteWeightRange] = useDeleteWeightRateMutation();

  const onWeightSubmit = async (data: WeightForm) => {
    try {
      const res: any = await useWeightMutation(data).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        resetWeight();
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  const handleDeleteRange = (id: number) => {
    try {
      const res: any = deleteWeightRange(id).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        resetWeight();
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <div>
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
            <p className="text-red-500 text-sm mt-1">This field is required</p>
          )}
        </div>

        <div className="flex gap-x-10">
          <div className="w-full">
            <p className="form-label font-bold">Min Weight</p>
            <input
              type="number"
              className="form-input"
              placeholder="lbs"
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
              placeholder="lbs"
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
            className="mt-8 px-4 py-2 md:py-4 text-white font-semibold bg-primary-green rounded w-47.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isWightLoading ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="border border-off-green/30 bg-off-green/30 rounded-lg p-4">
          <div className="text-primary-green text-sm flex gap-5 items-center">
            <span className="shrink-0 bg-off-green/60 size-14 rounded-full grid place-items-center">
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

        <div className="border border-off-green/30 bg-off-green/30 rounded-lg font-semibold -mt-2 p-4">
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
    </div>
  );
};

export default WeightConfigModal;
