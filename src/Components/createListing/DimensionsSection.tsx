import { Controller, Control, FieldErrors } from "react-hook-form";
import { FormData } from "./CreateListing";

interface DimensionsSectionProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  isBasicMember: boolean;
}

const DimensionsSection = ({
  control,
  errors,
  isBasicMember,
}: DimensionsSectionProps) => {
  return (
    <div>
      <h3
        className={`text-[20px] md:text-[24px] font-semibold ${
          isBasicMember ? "text-gray-400" : "text-secondary-black"
        }`}
      >
        Dimensions
      </h3>

      <div className="flex items-start gap-1.5 sm:gap-2 mt-2">
        {/* L */}
        <div className="flex-1 min-w-0">
          <Controller
            name="length"
            control={control}
            rules={{
              required: isBasicMember ? false : "Length is required",
              pattern: { value: /^\d+(\.\d+)?$/, message: "Invalid length" },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="0"
                step="any"
                placeholder="L"
                disabled={isBasicMember}
                className={`w-full min-w-0 h-[42px] md:h-[58px] border border-accent-gray rounded-lg px-2 md:px-4 text-[16px] md:text-[20px] text-secondary-black outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  isBasicMember
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
              />
            )}
          />
          {errors.length && (
            <p className="text-red-600 text-xs sm:text-sm mt-1 break-words">{errors.length.message}</p>
          )}
        </div>

        <span className="h-[42px] md:h-[58px] flex items-center justify-center text-secondary-black font-semibold shrink-0 text-xs sm:text-sm md:text-base">
          X
        </span>

        {/* W */}
        <div className="flex-1 min-w-0">
          <Controller
            name="width"
            control={control}
            rules={{
              required: isBasicMember ? false : "Width is required",
              pattern: { value: /^\d+(\.\d+)?$/, message: "Invalid width" },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="0"
                step="any"
                placeholder="W"
                disabled={isBasicMember}
                className={`w-full min-w-0 h-[42px] md:h-[58px] border border-accent-gray rounded-lg px-2 md:px-4 text-[16px] md:text-[20px] text-secondary-black outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  isBasicMember
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
              />
            )}
          />
          {errors.width && (
            <p className="text-red-600 text-xs sm:text-sm mt-1 break-words">{errors.width.message}</p>
          )}
        </div>

        <span className="h-[42px] md:h-[58px] flex items-center justify-center text-secondary-black font-semibold shrink-0 text-xs sm:text-sm md:text-base">
          X
        </span>

        {/* H */}
        <div className="flex-1 min-w-0">
          <Controller
            name="height"
            control={control}
            rules={{
              required: isBasicMember ? false : "Height is required",
              pattern: { value: /^\d+(\.\d+)?$/, message: "Invalid height" },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="0"
                step="any"
                placeholder="H"
                disabled={isBasicMember}
                className={`w-full min-w-0 h-[42px] md:h-[58px] border border-accent-gray rounded-lg px-2 md:px-4 text-[16px] md:text-[20px] text-secondary-black outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  isBasicMember
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
              />
            )}
          />
          {errors.height && (
            <p className="text-red-600 text-xs sm:text-sm mt-1 break-words">{errors.height.message}</p>
          )}
        </div>

        {/* Unit dropdown */}
        <Controller
          name="dimension_unit"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              disabled={isBasicMember}
              className={`h-[42px] md:h-[58px] border border-accent-gray rounded-lg px-2 md:px-4 text-[14px] md:text-[18px] text-secondary-black outline-0 shrink-0 bg-white ${
                isBasicMember
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : ""
              }`}
            >
              <option value="in">in</option>
              <option value="cm">cm</option>
              <option value="mm">mm</option>
            </select>
          )}
        />
      </div>

      {/* helper text */}
      <p className="text-sm text-gray-400 mt-1">Enter dimensions of package</p>
    </div>
  );
};

export default DimensionsSection;
