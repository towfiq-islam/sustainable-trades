import { useFormContext } from "react-hook-form";
import { State, Country } from "country-state-city";
import { useState } from "react";
const allowedCountries = Country.getAllCountries().filter(
  country => country.isoCode === "US" || country.isoCode === "CA",
);

const AddressForm = () => {
  const [state, setState] = useState<any>(null);
  const [country, setCountry] = useState<any>(null);
  const usStates = State.getStatesOfCountry("US");
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

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
          <span className="text-red-500">
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
          <span className="text-red-500">{errors.city.message as string}</span>
        )}
      </div>

      {/* Zip */}
      <div>
        <p className="form-label font-bold">zip_code *</p>
        <input
          type="text"
          {...register("zip_code", { required: "zip_code is required" })}
          className="form-input"
          placeholder="zip_code"
        />
        {errors.zip_code && (
          <span className="text-red-500">
            {errors.zip_code.message as string}
          </span>
        )}
      </div>

      {/* State + country */}
      <div className="grid grid-cols-2 gap-5">
        {/* Country */}
        <div>
          <p className="form-label font-bold">Country *</p>
          <select
            value={country || ""}
            {...register("country", {
              required: "Country is required",
            })}
            className="form-input"
            onChange={e => {
              const selectedCountry = e.target.value;
              setCountry(selectedCountry);
              setState("");
              setValue("country", selectedCountry, {
                shouldValidate: true,
              });
              setValue("state", "");
            }}
          >
            <option value="">Select Country</option>
            {allowedCountries.map(country => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>

          {errors.country && (
            <span className="text-red-500">
              {errors.country.message as string}
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
            <span className="text-red-500">
              {errors.state.message as string}
            </span>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddressForm;
