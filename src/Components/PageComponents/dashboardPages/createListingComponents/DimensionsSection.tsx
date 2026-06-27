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

      <div className="flex items-center gap-2 mt-2">
        {/* L */}
        <div className="w-full">
          <Controller
            name="length"
            control={control}
            rules={{
              required: "Length is required",
              pattern: {
                value: /^\d+(\.\d+)?$/,
                message: "Invalid length",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                placeholder="L"
                disabled={isBasicMember}
                className={`border border-accent-gray rounded-lg p-2 md:p-4 text-secondary-black outline-0 ${
                  isBasicMember
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
              />
            )}
          />
          {errors.length && (
            <p className="text-red-600 text-sm mt-1">{errors.length.message}</p>
          )}
        </div>

        <span className="text-secondary-black font-semibold shrink-0">X</span>

        {/* W */}
        <div className="w-full">
          <Controller
            name="width"
            control={control}
            rules={{
              required: "Width is required",
              pattern: {
                value: /^\d+(\.\d+)?$/,
                message: "Invalid width",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                placeholder="W"
                disabled={isBasicMember}
                className={`w-full border border-accent-gray rounded-lg p-2 md:p-4 text-secondary-black outline-0 ${
                  isBasicMember
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
              />
            )}
          />
          {errors.width && (
            <p className="text-red-600 text-sm  mt-1">{errors.width.message}</p>
          )}
        </div>

        <span className="text-secondary-black font-semibold shrink-0">X</span>

        {/* H */}
        <div className="w-full">
          <Controller
            name="height"
            control={control}
            rules={{
              required: "Height is required",
              pattern: {
                value: /^\d+(\.\d+)?$/,
                message: "Invalid height",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                placeholder="H"
                disabled={isBasicMember}
                className={`w-full border border-accent-gray rounded-lg p-2 md:p-4 text-secondary-black outline-0 ${
                  isBasicMember
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
              />
            )}
          />
          {errors.height && (
            <p className="text-red-600 text-sm mt-1">{errors.height.message}</p>
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
              className={`border border-accent-gray rounded-lg p-2 md:p-4 text-secondary-black outline-0 shrink-0 self-start ${
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
