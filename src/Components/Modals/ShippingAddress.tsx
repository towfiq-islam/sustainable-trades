"use client";
import { useGetShippingTax } from "@/Hooks/api/dashboard_api";
import useAuth from "@/Hooks/useAuth";
import { useForm } from "react-hook-form";
import { Country, State } from "country-state-city";
import { useState } from "react";
type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address: string;
  country: string;
  apt?: string;
  city: string;
  state: string;
  postal_code: string;
  shipping_option: string;
};

const allowedCountries = Country.getAllCountries().filter(
  country => country.isoCode === "US" || country.isoCode === "CA",
);

const ShippingAddress = ({
  onNext,
  setFormData,
  cart_id,
  shippingMethod,
  setTaxData,
}: {
  onNext: () => void;
  setFormData: any;
  cart_id: number | null;
  shippingMethod: any;
  setTaxData: any;
}) => {
  const { user } = useAuth();
  const { mutate: shippingTaxMutation, isPending } = useGetShippingTax();
  const [country, setCountry] = useState<any>(null);
  const [state, setState] = useState<any>(null);

  const handleShippingTax = () => {
    const payload = {
      cart_id,
      shipping_option:
        shippingMethod === "proceed"
          ? "proceed_to_shipping"
          : "arrange_local_pickup",
      country,
      state,
    };

    shippingTaxMutation(payload, {
      onSuccess: (res: any) => {
        if (res?.success) {
          setTaxData(res?.data);
        }
      },
    });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const countryName = Country.getCountryByCode(country)?.name || "";

    const payload = { ...data, country: countryName, state };
    setFormData(payload);
    onNext();
  };

  return (
    <>
      <h3 className="text-light-green font-semibold text-lg mb-3">
        Shipping Options
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name + Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">First Name *</label>
            <input
              type="text"
              className="form-input"
              defaultValue={user?.first_name}
              placeholder="Jon"
              {...register("first_name", {
                required: "First name is required",
              })}
            />
            {errors.first_name && (
              <p className="form-error">{errors.first_name.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Doe"
              defaultValue={user?.last_name}
              {...register("last_name", { required: "Last name is required" })}
            />
            {errors.last_name && (
              <p className="form-error">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              defaultValue={user?.email}
              {...register("email", { required: "Email is required" })}
              placeholder="example@mail.com"
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              defaultValue={user?.phone}
              {...register("phone", { required: "Phone is required" })}
              placeholder="+1 (000) 000-0000"
            />
            {errors.phone && (
              <p className="form-error">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Country + State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-secondary-black mb-2">
              Country *
            </label>

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
              <p className="text-red-500 text-sm mt-1">
                {errors.country.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-secondary-black mb-2">
              State *
            </label>

            <select
              {...register("state", {
                required: "State is required",
              })}
              className="form-input"
              value={state}
              onChange={e => {
                const selectedState = e.target.value;
                setState(selectedState);
                setValue("state", selectedState, {
                  shouldValidate: true,
                });
                handleShippingTax();
              }}
            >
              <option value="">Select State / Province</option>

              {State.getStatesOfCountry(country).map(item => (
                <option key={item.isoCode} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>

            {errors.state && (
              <p className="text-red-500 text-sm mt-1">
                {errors.state.message}
              </p>
            )}
          </div>
        </div>

        {/* City + Zip */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">City *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Austin"
              defaultValue={user?.city}
              {...register("city", { required: "City is required" })}
            />
            {errors.city && <p className="form-error">{errors.city.message}</p>}
          </div>

          <div>
            <label className="form-label">Zip Code *</label>
            <input
              type="text"
              className="form-input"
              placeholder="12345"
              defaultValue={user?.postal_code}
              {...register("postal_code", { required: "Zip code is required" })}
            />
            {errors.postal_code && (
              <p className="form-error">{errors.postal_code.message}</p>
            )}
          </div>
        </div>

        {/* Apt/Suite */}
        <div>
          <label className="form-label">Apt / Suite (Optional)</label>
          <input
            type="text"
            className="form-input"
            defaultValue={user?.apt}
            {...register("apt")}
            placeholder="Apartment / Suite"
          />
        </div>

        {/* Address */}
        <div>
          <label className="form-label">Address *</label>
          <textarea
            className="form-input"
            rows={2}
            defaultValue={user?.street_address}
            {...register("address", { required: "Address is required" })}
            placeholder="Texas, Austin"
          ></textarea>
          {errors.address && (
            <p className="form-error">{errors.address.message}</p>
          )}
        </div>

        {/* Button */}
        <button type="submit" className="primary_btn cursor-pointer">
          Review Order
        </button>
      </form>
    </>
  );
};

export default ShippingAddress;
