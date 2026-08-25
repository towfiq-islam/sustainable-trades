import { useFormContext } from "react-hook-form";
import { State } from "country-state-city";
import { useState } from "react";
const US_COUNTRY_CODE = "US";
const usStates = State.getStatesOfCountry(US_COUNTRY_CODE);

const AddressForm = () => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [state, setState] = useState<any>(() => getValues("state") || "");

  return (
    <form className="my-6 flex flex-col gap-3">
      <div>
        <p className="form-label font-bold">Address Line 1 *</p>
        <input
          type="text"
          {...register("address_line_1", {
            required: "Address Line 1 is required",
          })}
          className="form-input"
          placeholder="Address Line"
        />
        {errors.address_line_1 && (
          <span className="text-red-500 text-sm pt-1">
            {errors.address_line_1.message as string}
          </span>
        )}
      </div>

      <div>
        <p className="form-label font-bold">Address Line 2 (Optional)</p>
        <input
          type="text"
          {...register("address_line_2")}
          className="form-input"
          placeholder="Address"
        />
      </div>

      <div>
        <p className="form-label font-bold">City *</p>
        <input
          type="text"
          {...register("city", { required: "City is required" })}
          className="form-input"
          placeholder="City"
        />
        {errors.city && (
          <span className="text-red-500 text-sm pt-1">
            {errors.city.message as string}
          </span>
        )}
      </div>

      {/* State */}
      <div>
        <p className="form-label font-bold">State *</p>

        <select
          {...register("state", {
            required: "State is required",
          })}
          value={state}
          className="form-input"
          onChange={e => {
            setState(e.target.value);
            setValue("state", e.target.value, {
              shouldValidate: true,
            });
          }}
        >
          <option value="">Select State</option>

          {usStates.map(item => (
            <option key={item.isoCode} value={item.isoCode}>
              {item.name} ({item.isoCode})
            </option>
          ))}
        </select>

        {errors.state && (
          <span className="text-red-500 text-sm pt-1">
            {errors.state.message as string}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Zip */}
        <div>
          <p className="form-label font-bold">Zip Code *</p>
          <input
            type="text"
            {...register("zip_code", { required: "zip_code is required" })}
            className="form-input"
            placeholder="zip_code"
          />
          {errors.zip_code && (
            <span className="text-red-500 text-sm pt-1">
              {errors.zip_code.message as string}
            </span>
          )}
        </div>

        {/* Country */}
        <div>
          <p className="form-label font-bold">Country *</p>

          <input
            type="text"
            value="United States"
            disabled
            readOnly
            className="form-input bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <input
            type="hidden"
            {...register("country")}
            value={US_COUNTRY_CODE}
          />
        </div>
      </div>
    </form>
  );
};

export default AddressForm;
