import { Controller, UseFormReturn } from "react-hook-form";
import { FormData } from "./CreateListing";

interface QuantitySectionProps {
  control: UseFormReturn<FormData>["control"];
  errors: UseFormReturn<FormData>["formState"]["errors"];
  watch: UseFormReturn<FormData>["watch"];
  isBasicMember: boolean;
}

const QuantitySection = ({
  control,
  watch,
  isBasicMember,
}: QuantitySectionProps) => {
  const unlimitedStock = watch("unlimited_stock");

  return (
    <div>
      <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
        Quantity
      </h3>

      <Controller
        name="product_quantity"
        control={control}
        rules={{
          validate: value => {
            // if unlimited stock checked → no validation needed
            if (unlimitedStock) return true;

            // required validation
            if (!value) return "Quantity is required";

            // number validation
            if (!/^\d+$/.test(value.toString())) {
              return "Quantity must be a number";
            }

            return true;
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <div>
            <input
              type="number"
              {...field}
              disabled={unlimitedStock}
              className={`w-full lg:w-[350px] border border-accent-gray rounded-lg p-2 md:p-4 mt-2 text-secondary-black font-normal outline-0 ${
                unlimitedStock ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />

            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
          </div>
        )}
      />

      <div className="flex flex-col gap-4 mt-2">
        {/* Unlimited Stock */}
        <label
          className={`flex items-center gap-2 text-[20px] md:text-[24px] font-semibold ${
            isBasicMember ? "text-gray-400" : "text-secondary-black"
          }`}
        >
          Unlimited Stock
          <Controller
            name="unlimited_stock"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                name={field.name}
                ref={field.ref}
                checked={!!field.value}
                onChange={e => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                disabled={isBasicMember}
                className={`mt-1 accent-primary-green ${
                  isBasicMember ? "cursor-not-allowed" : ""
                }`}
              />
            )}
          />
        </label>

        {/* Feature */}
        <label className="flex items-center gap-2 text-[20px] md:text-[24px] text-secondary-black font-semibold">
          Feature
          <Controller
            name="is_featured"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                name={field.name}
                ref={field.ref}
                checked={!!field.value}
                onChange={e => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                className="mt-1 accent-primary-green"
              />
            )}
          />
        </label>

        {/* Out of Stock */}
        <label
          className={`flex items-center gap-2 text-[20px] md:text-[24px] font-semibold ${
            isBasicMember ? "text-gray-400" : "text-secondary-black"
          }`}
        >
          Out of Stock
          <Controller
            name="out_of_stock"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                name={field.name}
                ref={field.ref}
                checked={!!field.value}
                onChange={e => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                disabled={isBasicMember}
                className={`mt-1 accent-primary-green ${
                  isBasicMember ? "cursor-not-allowed" : ""
                }`}
              />
            )}
          />
        </label>

        <p className="text-[16px] text-secondary-black font-normal w-full md:max-w-[400px]">
          Status automatically changes to "Out of Inventory" when zero inventory
          is reached
        </p>
      </div>
    </div>
  );
};

export default QuantitySection;
