import { FormData } from "@/app/dashboard/basic/create-listing/page";
import { Controller, Control, FieldErrors, FieldError } from "react-hook-form";

interface PriceSectionProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  isBasicMember: boolean;
}

const PriceSection = ({
  control,
  errors,
  isBasicMember,
}: PriceSectionProps) => {
  const getErrorMessage = (fieldName: keyof FormData): string | undefined => {
    const error = errors[fieldName] as FieldError | undefined;
    return error?.message;
  };

  return (
    <div>
      <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
        Price
      </h3>
      <Controller
        name="product_price"
        control={control}
        rules={{
          required: "Price is required",
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: "Price must be a valid number (e.g., 10.99)",
          },
        }}
        render={({ field }) => (
          <input
            type="number"
            {...field}
            className="w-full border text-[16px] md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2 outline-0"
          />
        )}
      />
      {getErrorMessage("product_price") && (
        <p className="text-red-600 text-sm mt-1">
          {getErrorMessage("product_price")}
        </p>
      )}

      <div className="mt-4">
        <h3
          className={`text-[20px] md:text-[24px] font-semibold ${
            isBasicMember ? "text-gray-400" : "text-[#13141D]"
          }`}
        >
          Cost
        </h3>
        <Controller
          name="cost"
          control={control}
          rules={{
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Cost must be a valid number (e.g., 5.99)",
            },
          }}
          render={({ field }) => (
            <input
              type="number"
              {...field}
              disabled={isBasicMember}
              className={`w-full border text-[16px] md:text-[20px] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2 outline-0 ${
                isBasicMember
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "text-[#13141D]"
              }`}
            />
          )}
        />
        {getErrorMessage("cost") && (
          <p className="text-red-600 text-sm mt-1">{getErrorMessage("cost")}</p>
        )}
      </div>

      <div className="mt-4">
        <h3
          className={`text-[20px] md:text-[24px] font-semibold ${
            isBasicMember ? "text-gray-400" : "text-[#13141D]"
          }`}
        >
          Weight
        </h3>
        <Controller
          name="weight"
          control={control}
          rules={{
            pattern: {
              value: /^\d+$/,
              message: "Weight must be a number",
            },
          }}
          render={({ field }) => (
            <input
              type="number"
              {...field}
              disabled={isBasicMember}
              className={`w-full border text-[16px] md:text-[20px] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2 outline-0 ${
                isBasicMember
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "text-[#13141D]"
              }`}
            />
          )}
        />
        {getErrorMessage("weight") && (
          <p className="text-red-600 text-sm mt-1">
            {getErrorMessage("weight")}
          </p>
        )}
      </div>
    </div>
  );
};

export default PriceSection;
