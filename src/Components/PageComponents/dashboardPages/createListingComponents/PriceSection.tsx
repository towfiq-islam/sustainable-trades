import { Controller, Control, FieldErrors, FieldError } from "react-hook-form";
import { FormData } from "./CreateListing";

interface PriceSectionProps {
  errors: FieldErrors<FormData>;
  isBasicMember: boolean;
  control: any;
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
      <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
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
            className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2 outline-0"
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
            isBasicMember ? "text-gray-400" : "text-secondary-black"
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
              className={`w-full border text-[16px] md:text-[20px] border-accent-gray rounded-lg p-2 md:p-4 mt-2 outline-0 ${
                isBasicMember
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "text-secondary-black"
              }`}
            />
          )}
        />
        {getErrorMessage("cost") && (
          <p className="text-red-600 text-sm mt-1">{getErrorMessage("cost")}</p>
        )}
      </div>

      {/* <div className="mt-4">
        <h3
          className={`text-[20px] md:text-[24px] font-semibold ${
            isBasicMember ? "text-gray-400" : "text-secondary-black"
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
              className={`w-full border text-[16px] md:text-[20px] border-accent-gray rounded-lg p-2 md:p-4 mt-2 outline-0 ${
                isBasicMember
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "text-secondary-black"
              }`}
            />
          )}
        />
        {getErrorMessage("weight") && (
          <p className="text-red-600 text-sm mt-1">
            {getErrorMessage("weight")}
          </p>
        )}
      </div> */}
    </div>
  );
};

export default PriceSection;
