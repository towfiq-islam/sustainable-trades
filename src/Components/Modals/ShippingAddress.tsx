"use client";
import { useGetShippingTax } from "@/Hooks/api/dashboard_api";
import useAuth from "@/Hooks/useAuth";
import { useForm } from "react-hook-form";
import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

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
  formData,
  setTaxData,
}: {
  onNext: () => void;
  formData: any;
  setFormData: any;
  cart_id: number | null;
  shippingMethod: any;
  setTaxData: any;
}) => {
  const { user } = useAuth();
  const { mutateAsync: shippingTaxMutation, isPending } = useGetShippingTax();
  const [country, setCountry] = useState<any>(null);
  const [state, setState] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const countryName = Country.getCountryByCode(country)?.name || "";
    const taxData = {
      cart_id,
      shipping_option:
        shippingMethod === "proceed"
          ? "proceed_to_shipping"
          : "arrange_local_pickup",
      country: countryName,
      state,
      address: `${data?.address} ${data?.city} ${state} ${data?.postal_code}`,
    };

    shippingTaxMutation(taxData, {
      onSuccess: (res: any) => {
        if (res?.success) {
          setTaxData(res?.data);

          const payload = {
            ...data,
            country: countryName,
            state,
            shipping_option:
              shippingMethod === "proceed"
                ? "proceed_to_shipping"
                : "arrange_local_pickup",
            payment_method: "paypal",
          };
          setFormData(payload);
          onNext();
        }
      },
    });
  };

  useEffect(() => {
    if (formData?.first_name) setValue("first_name", formData?.first_name);
    if (formData?.last_name) setValue("last_name", formData?.last_name);
    if (formData?.email) setValue("email", formData?.email);
    if (formData?.phone) setValue("phone", formData?.phone);
    if (formData?.city) setValue("city", formData?.city);
    if (formData?.postal_code) setValue("postal_code", formData?.postal_code);
    if (formData?.apt) setValue("apt", formData?.apt);
    if (formData?.address) setValue("address", formData.address);

    if (formData?.country) {
      const countryCode =
        Country.getAllCountries().find(
          c => c.name === formData.country || c.isoCode === formData.country,
        )?.isoCode || "";
      setCountry(countryCode);
      setValue("country", countryCode);
    }

    if (formData?.state) {
      setState(formData.state);
      setValue("state", formData.state);
    }
  }, [formData, setValue]);

  return (
    <>
      <h3 className="text-light-green font-semibold text-xl mb-1">
        Shipping Options
      </h3>

      <p className="text-gray-600 mb-8">
        Please enter the address where your order will be shipped.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 shipping_form"
      >
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

        {/* Address */}
        <div>
          <label className="form-label">Address *</label>
          <input
            className="form-input"
            defaultValue={user?.street_address}
            placeholder="e.g. 200 Spectrum Center Dr"
            {...register("address", {
              required: "Address is required",
            })}
          />
          {errors.address && (
            <p className="form-error">{errors.address.message}</p>
          )}
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

        {/* Button */}
        <button
          type="submit"
          disabled={isPending}
          className="primary_btn cursor-pointer disabled:cursor-not-allowed disabled:animate-pulse disabled:opacity-70"
        >
          Review Order
        </button>
      </form>

      <div className="flex items-center justify-center gap-2 mt-3 text-gray-500">
        <Lock size={16} />
        <span>Your information is secure and encrypted.</span>
      </div>
    </>
  );
};

export default ShippingAddress;
